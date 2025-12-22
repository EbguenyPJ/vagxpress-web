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
import { OrdenCompraDetalle } from 'app/models/ordenCompraModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-detalle-orden-compra',
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
  templateUrl: './dialog-detalle-orden-compra.component.html',
  styleUrls: ['./dialog-detalle-orden-compra.component.scss']
})
export class DialogDetalleOrdenCompraComponent implements OnInit {

  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 's_numero_parte', label: 'Núm. Parte', type: 'text', visible: true },
    { def: 's_nombre_refaccion', label: 'Nombre', type: 'text', visible: true },
    { def: 'n_cantidad_sugerida', label: 'Cant. Sugerida', type: 'number', visible: true },
    { def: 'n_cantidad_solicitada', label: 'Cantidad', type: 'editable-number', visible: true },
    { def: 'n_costo_unitario', label: 'Precio Unit.', type: 'editable-currency', visible: true },
    { def: 'n_total_refaccion', label: 'Total', type: 'calculated-currency', visible: true },
    { def: 's_motivo_pedido', label: 'Motivo', type: 'badge', visible: true },
    { def: 's_prioridad', label: 'Prioridad', type: 'badge', visible: true },
  ];

  dataSource = new MatTableDataSource<OrdenCompraDetalle>([]);
  selection = new SelectionModel<OrdenCompraDetalle>(true, []);
  isLoading = true;
  granTotal: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<DialogDetalleOrdenCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ordenesCompraService: OrdenesCompraService
  ) {}

  ngOnInit(): void {
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.isLoading = true;

    this.ordenesCompraService.getDetalleOrdenCompra(this.data.s_token, this.data.id_orden_compra).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const refacciones = response.data[0] || [];
          this.dataSource.data = refacciones;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.calcularGranTotal();
          this.isLoading = false;
        } else {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudo cargar el detalle de la orden de compra'
          });
        }
      },
      (error) => {
        console.error('Error al cargar detalle:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar el detalle de la orden de compra'
        });
      }
    );
  }

  onCantidadChange(row: OrdenCompraDetalle, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = parseInt(input.value) || 0;

    if (newValue < 0) {
      row.n_cantidad_solicitada = 0;
      input.value = '0';
    } else {
      row.n_cantidad_solicitada = newValue;
    }

    this.calcularGranTotal();
  }

  onPrecioChange(row: OrdenCompraDetalle, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = parseFloat(input.value) || 0;

    if (newValue < 0) {
      row.n_costo_unitario = 0;
      input.value = '0';
    } else {
      row.n_costo_unitario = newValue;
    }

    this.calcularGranTotal();
  }

  calcularTotalRefaccion(row: OrdenCompraDetalle): number {
    const cantidad = row.n_cantidad_solicitada || 0;
    const precio = row.n_costo_unitario || 0;
    return cantidad * precio;
  }

  calcularGranTotal(): void {
    this.granTotal = this.dataSource.data.reduce((total, row) => {
      return total + this.calcularTotalRefaccion(row);
    }, 0);
  }

  guardar(): void {
    const ordenActualizada = {
      id_orden_compra: this.data.id_orden_compra,
      n_total_estimado: this.granTotal,
      detalles: this.dataSource.data.map(detalle => ({
        id_orden_compra_requisicion_refaccion: detalle.id_orden_compra_requisicion_refaccion,
        n_cantidad_solicitada: detalle.n_cantidad_solicitada,
        n_costo_unitario: detalle.n_costo_unitario
      }))
    };

    this.ordenesCompraService.actualizarOrdenCompra(this.data.s_token, ordenActualizada).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Orden de compra actualizada correctamente',
            timer: 2000,
            showConfirmButton: false
          });
          this.dialogRef.close(true);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudo actualizar la orden de compra'
          });
        }
      },
      (error) => {
        console.error('Error al actualizar orden:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar la orden de compra'
        });
      }
    );
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
