import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RequisicionesService } from 'app/services/compras/requisiciones.service';
import Swal from 'sweetalert2';

interface RefaccionPorProveedor {
  id_requisicion_refaccion: number;
  id_refaccion: number;
  s_numero_parte: string;
  s_nombre_refaccion: string;
  n_stock_actual: number;
  n_cantidad_sugerida: number;
  n_cantidad_solicitada: number;
  n_costo_unitario: number;
  s_motivo_pedido: string;
  s_prioridad: string;
}

interface GrupoProveedor {
  id_proveedor: number;
  s_nombre_proveedor: string;
  n_total_refacciones: number;
  n_total_estimado: number;
  refacciones: RefaccionPorProveedor[];
}

@Component({
  selector: 'app-dialog-generar-ordenes',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './dialog-generar-ordenes.component.html',
  styleUrls: ['./dialog-generar-ordenes.component.scss']
})
export class DialogGenerarOrdenesComponent implements OnInit {

  gruposProveedores: GrupoProveedor[] = [];
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<DialogGenerarOrdenesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requisicionesService: RequisicionesService
  ) {}

  ngOnInit(): void {
    this.cargarYAgruparRefacciones();
  }

  cargarYAgruparRefacciones(): void {
    this.isLoading = true;

    this.requisicionesService.getDetalleRequisicion(this.data.s_token, this.data.id_requisicion).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const refacciones = response.data[0] || [];
          this.agruparPorProveedor(refacciones);
          this.isLoading = false;
        } else {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudo cargar el detalle de la requisición'
          });
        }
      },
      (error) => {
        console.error('Error al cargar detalle:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar el detalle de la requisición'
        });
      }
    );
  }

  agruparPorProveedor(refacciones: any[]): void {
    const grupos = new Map<number, GrupoProveedor>();

    refacciones.forEach(refaccion => {
      if (!grupos.has(refaccion.id_proveedor)) {
        grupos.set(refaccion.id_proveedor, {
          id_proveedor: refaccion.id_proveedor,
          s_nombre_proveedor: refaccion.s_nombre_proveedor,
          n_total_refacciones: 0,
          n_total_estimado: 0,
          refacciones: []
        });
      }

      const grupo = grupos.get(refaccion.id_proveedor)!;
      grupo.refacciones.push(refaccion);
      grupo.n_total_refacciones++;
      grupo.n_total_estimado += refaccion.n_cantidad_solicitada * refaccion.n_costo_unitario;
    });

    this.gruposProveedores = Array.from(grupos.values());
  }

  calcularTotalRefaccion(refaccion: RefaccionPorProveedor): number {
    return refaccion.n_cantidad_solicitada * refaccion.n_costo_unitario;
  }

  generarOrdenProveedor(grupo: GrupoProveedor): void {
    Swal.fire({
      title: '¿Generar orden de compra?',
      html: `Se generará una orden de compra para:<br><strong>${grupo.s_nombre_proveedor}</strong><br>Total: <strong>$${grupo.n_total_estimado.toFixed(2)}</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulación de generación de orden
        Swal.fire({
          icon: 'success',
          title: 'Orden generada',
          text: `Orden de compra generada para ${grupo.s_nombre_proveedor}`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  generarTodasLasOrdenes(): void {
    if (this.gruposProveedores.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin proveedores',
        text: 'No hay proveedores para generar órdenes'
      });
      return;
    }

    const totalOrdenes = this.gruposProveedores.length;
    const totalGeneral = this.gruposProveedores.reduce((sum, grupo) => sum + grupo.n_total_estimado, 0);

    Swal.fire({
      title: '¿Generar todas las órdenes?',
      html: `Se generarán <strong>${totalOrdenes}</strong> órdenes de compra<br>Total general: <strong>$${totalGeneral.toFixed(2)}</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar todas',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulación de generación de todas las órdenes
        Swal.fire({
          icon: 'success',
          title: 'Órdenes generadas',
          text: `Se generaron ${totalOrdenes} órdenes de compra correctamente`,
          timer: 2500,
          showConfirmButton: false
        }).then(() => {
          this.dialogRef.close('ordenes_generadas');
        });
      }
    });
  }

  getBadgeClass(campo: string, valor: string): string {
    if (campo === 's_prioridad') {
      switch (valor?.toLowerCase()) {
        case 'urgente':
          return 'badge-solid-red';
        case 'alta':
          return 'badge-solid-orange';
        case 'media':
          return 'badge-solid-blue';
        case 'baja':
          return 'badge-solid-green';
        default:
          return 'badge-solid-grey';
      }
    } else if (campo === 's_motivo_pedido') {
      switch (valor?.toLowerCase()) {
        case 'stock bajo':
          return 'badge-solid-orange';
        case 'reposición':
        case 'reposicion':
          return 'badge-solid-blue';
        case 'pedido especial':
          return 'badge-solid-purple';
        default:
          return 'badge-solid-grey';
      }
    }
    return 'badge-solid-grey';
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
