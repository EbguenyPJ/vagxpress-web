import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
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

  mostrarMejorPrecio(item: any, proveedorActual: any): void {
    const mejorOpcion = item.mejor_opcion;
    const ahorroUnitario = parseFloat(mejorOpcion.n_ahorro_unitario) || 0;
    const ahorroTotal = ahorroUnitario * item.n_cantidad_sugerida;
    const costoActual = parseFloat(item.n_costo_unitario) || 0;
    const costoNuevo = parseFloat(mejorOpcion.n_ultimo_costo) || 0;

    Swal.fire({
      title: 'Mejor Precio Disponible',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <h4 style="margin-bottom: 1rem; color: #1976d2;">📦 ${item.s_nombre_refaccion}</h4>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
            <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px;">
              <p style="margin: 0; font-size: 0.875rem; color: #666;">Proveedor Actual</p>
              <p style="margin: 0.5rem 0; font-weight: bold; font-size: 1.1rem;">${proveedorActual.s_proveedor}</p>
              <p style="margin: 0; color: #f44336; font-size: 1.2rem; font-weight: bold;">$${costoActual.toFixed(2)}</p>
            </div>

            <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; border: 2px solid #4caf50;">
              <p style="margin: 0; font-size: 0.875rem; color: #666;">Mejor Opción</p>
              <p style="margin: 0.5rem 0; font-weight: bold; font-size: 1.1rem;">${mejorOpcion.s_proveedor}</p>
              <p style="margin: 0; color: #4caf50; font-size: 1.2rem; font-weight: bold;">$${costoNuevo.toFixed(2)}</p>
            </div>
          </div>

          <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; border-left: 4px solid #ff9800;">
            <p style="margin: 0; font-size: 0.875rem; color: #666;">Ahorro</p>
            <p style="margin: 0.25rem 0; font-weight: bold;">Por unidad: <span style="color: #ff9800;">$${ahorroUnitario.toFixed(2)}</span></p>
            <p style="margin: 0; font-weight: bold;">Total (${item.n_cantidad_sugerida} unidades): <span style="color: #ff9800; font-size: 1.2rem;">$${ahorroTotal.toFixed(2)}</span></p>
          </div>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '<i class="material-icons" style="vertical-align: middle;">swap_horiz</i> Cambiar a este proveedor',
      cancelButtonText: 'Mantener actual',
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#9e9e9e',
      customClass: {
        confirmButton: 'btn-cambiar-proveedor'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.cambiarProveedor(item, proveedorActual, mejorOpcion.id_proveedor, mejorOpcion.s_proveedor);
      }
    });
  }

  cambiarProveedor(item: any, proveedorOrigen: any, id_proveedor_destino: number, s_proveedor_destino: string): void {
    // Buscar si el proveedor destino ya existe en la lista
    let proveedorDestino = this.proveedores.find(p => p.id_proveedor === id_proveedor_destino);

    // Si no existe, crear nuevo grupo de proveedor
    if (!proveedorDestino) {
      proveedorDestino = {
        id_proveedor: id_proveedor_destino,
        s_proveedor: s_proveedor_destino,
        total_estimado_proveedor: 0,
        cantidad_refacciones_proveedor: 0,
        items: []
      };
      this.proveedores.push(proveedorDestino);
      // Expandir el nuevo proveedor
      this.proveedoresExpandidos[id_proveedor_destino] = true;
    }

    // Actualizar el id_proveedor del item
    item.id_proveedor = id_proveedor_destino;
    item.s_proveedor = s_proveedor_destino;
    // Actualizar costo con el mejor precio
    item.n_costo_unitario = item.mejor_opcion.n_ultimo_costo;

    // Remover item del proveedor origen
    const indexEnOrigen = proveedorOrigen.items.indexOf(item);
    if (indexEnOrigen > -1) {
      proveedorOrigen.items.splice(indexEnOrigen, 1);
    }

    // Agregar item al proveedor destino
    proveedorDestino.items.push(item);

    // Actualizar totales
    proveedorOrigen.cantidad_refacciones_proveedor = proveedorOrigen.items.length;
    proveedorOrigen.total_estimado_proveedor = this.calcularTotalProveedor(proveedorOrigen);
    proveedorDestino.cantidad_refacciones_proveedor = proveedorDestino.items.length;
    proveedorDestino.total_estimado_proveedor = this.calcularTotalProveedor(proveedorDestino);

    // Eliminar proveedor origen si ya no tiene items
    if (proveedorOrigen.items.length === 0) {
      const indexProveedor = this.proveedores.indexOf(proveedorOrigen);
      if (indexProveedor > -1) {
        this.proveedores.splice(indexProveedor, 1);
      }
    }

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Refacción movida a ${s_proveedor_destino}`,
      showConfirmButton: false,
      timer: 3000
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
