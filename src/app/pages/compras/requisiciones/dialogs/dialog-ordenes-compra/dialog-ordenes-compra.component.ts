import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { RequisicionesService } from 'app/services/compras/requisiciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-ordenes-compra',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './dialog-ordenes-compra.component.html',
  styleUrls: ['./dialog-ordenes-compra.component.scss']
})
export class DialogOrdenesCompraComponent implements OnInit {

  proveedores: any[] = [];
  isLoading = true;
  proveedoresExpandidos: { [key: number]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<DialogOrdenesCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requisicionesService: RequisicionesService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;

    this.requisicionesService.getRequisicionPorProveedor(this.data.s_token, this.data.id_requisicion).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.proveedores = response.data || [];
          // Inicializar todos los proveedores como contraídos y todos los items como autorizados
          this.proveedores.forEach((proveedor) => {
            this.proveedoresExpandidos[proveedor.id_proveedor] = false;
            // Agregar propiedad b_autorizada a cada item (por defecto true)
            proveedor.items.forEach((item: any) => {
              item.b_autorizada = true;
            });
          });
          this.isLoading = false;
        } else {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudieron cargar los datos'
          });
        }
      },
      (error) => {
        console.error('Error al cargar datos:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar los datos'
        });
      }
    );
  }

  toggleProveedor(id_proveedor: number): void {
    this.proveedoresExpandidos[id_proveedor] = !this.proveedoresExpandidos[id_proveedor];
  }

  isProveedorExpandido(id_proveedor: number): boolean {
    return this.proveedoresExpandidos[id_proveedor] || false;
  }

  calcularCostoTotal(item: any): number {
    const costo = parseFloat(item.n_costo_unitario) || 0;
    const cantidad = parseFloat(item.n_cantidad_sugerida) || 0;
    return costo * cantidad;
  }

  calcularTotalProveedor(proveedor: any): number {
    return proveedor.items.reduce((total: number, item: any) => {
      if (item.b_autorizada) {
        return total + this.calcularCostoTotal(item);
      }
      return total;
    }, 0);
  }

  contarRefaccionesAutorizadas(proveedor: any): number {
    return proveedor.items.filter((item: any) => item.b_autorizada).length;
  }

  generarOrden(proveedor: any): void {
    const totalAutorizado = this.calcularTotalProveedor(proveedor);
    const refaccionesAutorizadas = this.contarRefaccionesAutorizadas(proveedor);

    Swal.fire({
      title: `¿Generar orden para ${proveedor.s_proveedor}?`,
      html: `
        <p>Refacciones autorizadas: <strong>${refaccionesAutorizadas}</strong></p>
        <p>Total estimado: <strong>$${totalAutorizado.toFixed(2)}</strong></p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = this.construirPayload([proveedor]);
        this.enviarOrdenesCompra(payload, `Orden generada para ${proveedor.s_proveedor}`);
      }
    });
  }

  generarTodasOrdenes(): void {
    const totalProveedores = this.proveedores.length;
    const totalGeneral = this.proveedores.reduce((sum, p) => sum + this.calcularTotalProveedor(p), 0);
    const totalRefaccionesAutorizadas = this.proveedores.reduce((sum, p) => sum + this.contarRefaccionesAutorizadas(p), 0);

    Swal.fire({
      title: '¿Generar todas las órdenes?',
      html: `
        <p>Se generarán <strong>${totalProveedores}</strong> órdenes de compra</p>
        <p>Refacciones autorizadas: <strong>${totalRefaccionesAutorizadas}</strong></p>
        <p>Total estimado: <strong>$${totalGeneral.toFixed(2)}</strong></p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar todas',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = this.construirPayload(this.proveedores);
        this.enviarOrdenesCompra(payload, `${totalProveedores} órdenes generadas correctamente`);
      }
    });
  }

  construirPayload(proveedores: any[]): any {
    return {
      ordenes: proveedores.map(proveedor => ({
        id_requisicion: this.data.id_requisicion,
        id_proveedor: proveedor.id_proveedor,
        refacciones: proveedor.items.map((item: any) => ({
          id_requisicion_refaccion: item.id_requisicion_refaccion,
          b_autorizada: item.b_autorizada ? 1 : 0
        }))
      }))
    };
  }

  enviarOrdenesCompra(payload: any, mensajeExito: string): void {
    this.requisicionesService.crearOrdenesCompras(this.data.s_token, payload).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: mensajeExito,
            showConfirmButton: false,
            timer: 3000
          });
          this.dialogRef.close({ success: true });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudieron generar las órdenes de compra'
          });
        }
      },
      (error) => {
        console.error('Error al generar órdenes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al generar las órdenes de compra'
        });
      }
    );
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
