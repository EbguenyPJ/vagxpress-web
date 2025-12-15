import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { CommonModule, formatDate, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Venta } from 'app/models/ventaModel';
import { BitacoraVentasService } from 'app/services/bitacora-ventas/bitacora-ventas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bitacora-ventas',
  templateUrl: './bitacora-ventas.component.html',
  styleUrls: ['./bitacora-ventas.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
  ]
})
export class BitacoraVentasComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id_venta', label: 'ID Venta', type: 'text', visible: true },
    { def: 'n_cantidad_refacciones', label: 'Cant. Refacciones', type: 'number', visible: true },
    { def: 'n_subtotal', label: 'Subtotal', type: 'currency', visible: true },
    { def: 'n_total', label: 'Total', type: 'currency', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Venta>([]);
  selection = new SelectionModel<Venta>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();
  s_token: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Bitácora de Ventas',
      items: ['Inicio'],
      active: 'Bitácora de Ventas',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public bitacoraVentasService: BitacoraVentasService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const id_usuario = currentUser.id_usuario;
        this.s_token = currentUser.token;
        // Regla del líder del proyecto: enviar token como string vacío en esta etapa
        this.s_token = '';
      } catch (error) {
        console.error('Error al leer el usuario del localStorage', error);
      }
    }
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  verDetalle(row: Venta) {
    Swal.fire({
      icon: 'info',
      title: `Venta #${row.id_venta}`,
      html: `
        <div style="text-align: left;">
          <p><strong>ID Venta:</strong> ${row.id_venta}</p>
          <p><strong>Cantidad de Refacciones:</strong> ${row.n_cantidad_refacciones}</p>
          <p><strong>Subtotal:</strong> $${row.n_subtotal.toFixed(2)}</p>
          <p><strong>Total:</strong> $${row.n_total.toFixed(2)}</p>
        </div>
      `,
      confirmButtonText: 'Cerrar'
    });
  }

  editarVenta(row: Venta) {
    Swal.fire({
      icon: 'info',
      title: 'Editar venta',
      text: `Funcionalidad de edición para venta #${row.id_venta} en desarrollo`,
      confirmButtonText: 'Entendido'
    });
  }

  deleteItem(row: Venta) {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar venta?',
      text: `Se eliminará la venta #${row.id_venta}`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id_venta !== row.id_venta
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Venta eliminada correctamente',
          'bottom',
          'center'
        );
      }
    });
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} venta(s) eliminada(s) correctamente`,
      'bottom',
      'center'
    );
  }

  loadData() {
    this.isLoading = true;

    this.bitacoraVentasService.getVentas(this.s_token).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.dataSource.data = response.data.map((v: any) => new Venta(v));
          this.refreshTable();
          this.dataSource.filterPredicate = (data: Venta, filter: string) =>
            Object.values(data).some((value) =>
              value.toString().toLowerCase().includes(filter)
            );
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las ventas. Intenta nuevamente.'
        });
      },
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
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

  onContextMenu(event: MouseEvent, item: Venta) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
