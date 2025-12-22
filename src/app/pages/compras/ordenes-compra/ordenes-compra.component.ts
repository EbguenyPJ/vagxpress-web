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
import { OrdenCompra } from 'app/models/ordenCompraModel';
import { OrdenesCompraService } from 'app/services/compras/ordenes-compra.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetalleOrdenCompraComponent } from './dialogs/dialog-detalle-orden-compra/dialog-detalle-orden-compra.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordenes-compra',
  templateUrl: './ordenes-compra.component.html',
  styleUrls: ['./ordenes-compra.component.scss'],
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
export class OrdenesCompraComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 's_folio_interno', label: 'Folio', type: 'text', visible: true },
    { def: 'id_requisicion', label: 'Requisición', type: 'text', visible: true },
    { def: 's_nombre_proveedor', label: 'Proveedor', type: 'text', visible: true },
    { def: 'd_fecha_orden', label: 'Fecha Orden', type: 'date', visible: true },
    { def: 'd_fecha_recepcion_estimada', label: 'Recepción Estimada', type: 'date', visible: true },
    { def: 'n_total_estimado', label: 'Total Estimado', type: 'currency', visible: true },
    { def: 's_estatus_orden_compra', label: 'Estatus', type: 'badge', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<OrdenCompra>([]);
  selection = new SelectionModel<OrdenCompra>(true, []);
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
      title: 'Órdenes de Compra',
      items: ['Compras'],
      active: 'Órdenes de Compra',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public ordenesCompraService: OrdenesCompraService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const id_usuario = currentUser.id_usuario;
        this.s_token = currentUser.token;
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

  verDetalle(row: OrdenCompra) {
    this.dialog.open(DialogDetalleOrdenCompraComponent, {
      width: '95vw',
      maxWidth: '1400px',
      data: {
        id_orden_compra: row.id_orden_compra,
        s_folio_interno: row.s_folio_interno,
        s_nombre_proveedor: row.s_nombre_proveedor,
        id_requisicion: row.id_requisicion,
        s_token: this.s_token
      }
    });
  }

  editarOrdenCompra(row: OrdenCompra) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: `Editar orden de compra ${row.s_folio_interno}`,
      showConfirmButton: false,
      timer: 2000
    });
  }

  deleteItem(row: OrdenCompra) {
    Swal.fire({
      title: '¿Eliminar orden de compra?',
      text: `Se eliminará la orden ${row.s_folio_interno}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSource.data = this.dataSource.data.filter(
          (item) => item.id_orden_compra !== row.id_orden_compra
        );
        this.showNotification(
          'snackbar-danger',
          'Orden de compra eliminada correctamente',
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
      `${totalSelect} orden(es) de compra eliminada(s) correctamente`,
      'bottom',
      'center'
    );
  }

  loadData() {
    this.isLoading = true;

    this.ordenesCompraService.getOrdenesCompra(this.s_token).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const ordenes = response.data.map((orden: any) => new OrdenCompra(orden));
          this.dataSource.data = ordenes;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudieron cargar las órdenes de compra'
          });
        }
      },
      (error) => {
        console.error('Error al cargar órdenes de compra:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar las órdenes de compra'
        });
      }
    );
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

  getBadgeClass(estatus: string): string {
    switch (estatus.toLowerCase()) {
      case 'pendiente':
        return 'badge-solid-orange';
      case 'autorizada':
        return 'badge-solid-blue';
      case 'en tránsito':
      case 'en transito':
        return 'badge-solid-purple';
      case 'recibida':
        return 'badge-solid-green';
      case 'cancelada':
        return 'badge-solid-red';
      default:
        return 'badge-solid-grey';
    }
  }

  onContextMenu(event: MouseEvent, item: OrdenCompra) {
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
