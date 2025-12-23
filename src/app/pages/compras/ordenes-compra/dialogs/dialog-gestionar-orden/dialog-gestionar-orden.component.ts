import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { OrdenesCompraService } from 'app/services/compras/ordenes-compra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-gestionar-orden',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatRippleModule,
    FormsModule
  ],
  templateUrl: './dialog-gestionar-orden.component.html',
  styleUrls: ['./dialog-gestionar-orden.component.scss']
})
export class DialogGestionarOrdenComponent implements OnInit {

  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 's_numero_parte', label: 'Núm. Parte', type: 'text', visible: true },
    { def: 's_nombre_refaccion', label: 'Nombre', type: 'text', visible: true },
    { def: 'n_cantidad_sugerida', label: 'Cant. Sugerida', type: 'number', visible: true },
    { def: 'n_cantidad', label: 'Cantidad', type: 'editable', visible: true },
    { def: 'n_costo_unitario', label: 'Costo Unit.', type: 'currency', visible: true },
    { def: 'n_total', label: 'Total', type: 'calculated', visible: true },
    { def: 's_motivo_pedido', label: 'Motivo', type: 'badge', visible: true },
    { def: 's_prioridad', label: 'Prioridad', type: 'badge', visible: true },
  ];

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<DialogGestionarOrdenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ordenesCompraService: OrdenesCompraService
  ) {}

  ngOnInit(): void {
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.isLoading = true;

    this.ordenesCompraService.getOrdenCompra(this.data.s_token, this.data.id_orden_compra).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const refacciones = response.data || [];
          // Agregar propiedad n_cantidad (inicialmente con el valor de n_cantidad_sugerida)
          refacciones.forEach((item: any) => {
            item.n_cantidad = item.n_cantidad_sugerida;
          });
          this.dataSource.data = refacciones;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudo cargar el detalle de la orden'
          });
        }
      },
      (error) => {
        console.error('Error al cargar detalle:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar el detalle de la orden'
        });
      }
    );
  }

  calcularTotal(item: any): number {
    const cantidad = parseFloat(item.n_cantidad) || 0;
    const costo = parseFloat(item.n_costo_unitario) || 0;
    return cantidad * costo;
  }

  calcularGranTotal(): number {
    return this.dataSource.data.reduce((total, item) => {
      return total + this.calcularTotal(item);
    }, 0);
  }

  onCantidadChange(): void {
    // Método para forzar la actualización de la vista cuando cambia la cantidad
    // Angular detectará el cambio automáticamente, pero esto asegura el recálculo
  }

  esOrdenCreada(): boolean {
    return this.data.id_estatus_orden_compra === 1;
  }

  aprobarOrden(): void {
    Swal.fire({
      title: '¿Aprobar orden de compra?',
      text: `Se aprobará la orden ${this.data.s_folio_interno}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          refacciones: this.dataSource.data.map(item => ({
            s_numero_parte: item.s_numero_parte,
            n_cantidad: parseFloat(item.n_cantidad)
          }))
        };

        this.ordenesCompraService.aprobarOrdenCompra(
          this.data.s_token,
          this.data.id_orden_compra,
          payload
        ).subscribe(
          (response: any) => {
            if (response.status === 'success') {
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Orden aprobada correctamente',
                showConfirmButton: false,
                timer: 3000
              });
              this.dialogRef.close({ success: true });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message || 'No se pudo aprobar la orden'
              });
            }
          },
          (error) => {
            console.error('Error al aprobar orden:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al aprobar la orden'
            });
          }
        );
      }
    });
  }

  rechazarOrden(): void {
    Swal.fire({
      title: '¿Rechazar orden de compra?',
      text: `Se rechazará la orden ${this.data.s_folio_interno}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordenesCompraService.rechazarOrdenCompra(
          this.data.s_token,
          this.data.id_orden_compra
        ).subscribe(
          (response: any) => {
            if (response.status === 'success') {
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Orden rechazada correctamente',
                showConfirmButton: false,
                timer: 3000
              });
              this.dialogRef.close({ success: true });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message || 'No se pudo rechazar la orden'
              });
            }
          },
          (error) => {
            console.error('Error al rechazar orden:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al rechazar la orden'
            });
          }
        );
      }
    });
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  exportExcel() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Exportando a Excel...',
      showConfirmButton: false,
      timer: 2000
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
