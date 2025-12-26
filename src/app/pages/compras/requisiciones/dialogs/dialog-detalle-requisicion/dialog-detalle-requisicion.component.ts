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
import { RequisicionesService } from 'app/services/compras/requisiciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-detalle-requisicion',
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
  templateUrl: './dialog-detalle-requisicion.component.html',
  styleUrls: ['./dialog-detalle-requisicion.component.scss']
})
export class DialogDetalleRequisicionComponent implements OnInit {

  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 's_numero_parte', label: 'Núm. Parte', type: 'text', visible: true },
    { def: 's_nombre_refaccion', label: 'Nombre', type: 'text', visible: true },
    { def: 'n_stock_actual', label: 'Stock Actual', type: 'number', visible: true },
    { def: 'n_cantidad_sugerida', label: 'Cantidad Sugerida', type: 'number', visible: true },
    { def: 'n_costo_unitario', label: 'Costo', type: 'currency', visible: true },
    { def: 's_motivo_pedido', label: 'Motivo', type: 'badge', visible: true },
    { def: 's_prioridad', label: 'Prioridad', type: 'badge', visible: true },
  ];

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isLoading = true;
  id_estatus_requisicion: number = 0;
  s_estatus_requisicion: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<DialogDetalleRequisicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requisicionesService: RequisicionesService
  ) {}

  ngOnInit(): void {
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.isLoading = true;

    this.requisicionesService.getDetalleRequisicion(this.data.s_token, this.data.id_requisicion).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          // La respuesta viene en data[0] según la estructura proporcionada
          const refacciones = response.data[0] || [];
          this.dataSource.data = refacciones;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          // Obtener estatus de la primera refacción (todas tienen el mismo estatus de requisición)
          if (refacciones.length > 0) {
            this.id_estatus_requisicion = refacciones[0].id_estatus_requisicion || 0;
            this.s_estatus_requisicion = this.obtenerNombreEstatus(this.id_estatus_requisicion);
          }

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

  obtenerNombreEstatus(id_estatus: number): string {
    const estatusMap: { [key: number]: string } = {
      1: 'Abierta',
      2: 'Cerrada',
      3: 'Aprobada',
      4: 'Cancelada'
    };
    return estatusMap[id_estatus] || 'Desconocido';
  }

  obtenerColorEstatus(): string {
    const coloresMap: { [key: number]: string } = {
      1: '#4CAF50',  // Verde - Abierta
      2: '#2196F3',  // Azul - Cerrada
      3: '#9C27B0',  // Púrpura - Aprobada
      4: '#F44336'   // Rojo - Cancelada
    };
    return coloresMap[this.id_estatus_requisicion] || '#999';
  }

  esRequisicionAbierta(): boolean {
    return this.id_estatus_requisicion === 1;
  }

  cerrarRequisicion(): void {
    Swal.fire({
      title: '¿Cerrar requisición?',
      text: 'La requisición cambiará a estatus "Cerrada"',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarEstatus(2);
      }
    });
  }

  cancelarRequisicion(): void {
    Swal.fire({
      title: '¿Cancelar requisición?',
      text: 'La requisición cambiará a estatus "Cancelada"',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarEstatus(4);
      }
    });
  }

  actualizarEstatus(id_estatus: number): void {
    const payload = {
      id_estatus_requisicion: id_estatus
    };

    this.requisicionesService.actualizarRequisicion(
      this.data.s_token,
      this.data.id_requisicion,
      payload
    ).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Requisición actualizada correctamente',
            showConfirmButton: false,
            timer: 3000
          });
          this.id_estatus_requisicion = id_estatus;
          this.s_estatus_requisicion = this.obtenerNombreEstatus(id_estatus);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudo actualizar la requisición'
          });
        }
      },
      (error) => {
        console.error('Error al actualizar requisición:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar la requisición'
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

  cerrar(): void {
    this.dialogRef.close();
  }
}
