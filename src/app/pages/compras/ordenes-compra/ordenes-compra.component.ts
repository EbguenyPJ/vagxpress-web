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
import { DialogGestionarOrdenComponent } from './dialogs/dialog-gestionar-orden/dialog-gestionar-orden.component';
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
    { def: 'id_requisicion', label: 'ID Requisición', type: 'number', visible: true },
    { def: 's_proveedor', label: 'Proveedor', type: 'text', visible: true },
    { def: 'd_fecha_orden', label: 'Fecha Orden', type: 'date', visible: true },
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
        this.s_token = currentUser.token;
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

  gestionarOrden(row: OrdenCompra) {
    const dialogRef = this.dialog.open(DialogGestionarOrdenComponent, {
      width: '95vw',
      maxWidth: '1400px',
      data: {
        id_orden_compra: row.id_orden_compra,
        s_folio_interno: row.s_folio_interno,
        s_proveedor: row.s_proveedor,
        id_requisicion: row.id_requisicion,
        id_estatus_orden_compra: row.id_estatus_orden_compra,
        s_token: this.s_token
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
      }
    });
  }

  descargarPdf(row: OrdenCompra) {
    Swal.fire({
      title: 'Descargando PDF...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.ordenesCompraService.descargarOrdenCompraPdf(this.s_token, row.id_orden_compra).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          Swal.close();

          // Decodificar base64 y crear el blob
          const byteCharacters = atob(response.data.file_base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });

          // Crear URL y descargar
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${response.data.folio}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'PDF descargado correctamente',
            showConfirmButton: false,
            timer: 3000
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudo descargar el PDF'
          });
        }
      },
      (error) => {
        console.error('Error al descargar PDF:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al descargar el PDF'
        });
      }
    );
  }

  esOrdenAprobada(row: OrdenCompra): boolean {
    return row.id_estatus_orden_compra === 2;
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
      `${totalSelect} orden(es) eliminada(s) correctamente`,
      'bottom',
      'center'
    );
  }

  loadData() {
    this.isLoading = true;

    this.ordenesCompraService.getOrdenesCompra(this.s_token).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const ordenes = response.data.map((ord: any) => new OrdenCompra(ord));
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
        console.error('Error al cargar órdenes:', error);
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
