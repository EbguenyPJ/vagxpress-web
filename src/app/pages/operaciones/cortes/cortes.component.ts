import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { rowsAnimation, TableExportUtil } from '@shared';
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
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { HttpClient } from '@angular/common/http';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Direction } from '@angular/cdk/bidi';

// Services and Models
import { EmpleadosService } from 'app/services/empleados/empleados.service';
import { empleadosModel } from 'app/models/empleadosModel';
import { DialogCrearEmpleadoComponent } from 'app/pages/administracion/empleados/dialogs/dialog-crear-empleado/dialog-crear-empleado.component';
import { conexion } from 'app/conexion';

@Component({
  selector: 'app-cortes',
  templateUrl: './cortes.component.html',
  styleUrl: './cortes.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  animations: [rowsAnimation],
  imports: [
    BreadcrumbComponent,
    FeatherIconsComponent,
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
    //DatePipe,
  ],
  standalone: true
})
export class CortesComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id_empleado', label: '#', type: 'idTabla', visible: true },
    { def: 's_nombre', label: 'Nombre', type: 'text', visible: true },
    { def: 's_tipo_empleado', label: 'Tipo', type: 'text', visible: true },
    { def: 's_sucursal', label: 'Sucursal', type: 'text', visible: true },
    { def: 'n_telefono', label: 'Teléfono', type: 'phone', visible: true },
    { def: 's_estado_disponibilidad', label: 'Disponibilidad', type: 'text', visible: true },
    { def: 'b_activo', label: 'Estatus', type: 'text', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<empleadosModel>([]);
  selection = new SelectionModel<empleadosModel>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  empleadosModel: empleadosModel[] = [];
  data: any;
  ruta_img: any = conexion.url_img + "/empleados/";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter: ElementRef | undefined;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public EmpleadosService: EmpleadosService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  getEmpleadoImage(imagen: string): string {
    if (!imagen || imagen === 'empleado-default.png') {
      return this.ruta_img + 'empleado-default.png';
    }
    return this.ruta_img + imagen;
  }

  addNew() {
    this.openDialog('add');
  }

  editCall(row: empleadosModel) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: empleadosModel) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DialogCrearEmpleadoComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { empleadosModel: data, action },
      direction: varDirection,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Actualizamos siempre al cerrar el diálogo
      this.refresh();
      if (result) {
        if (action === 'add') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        this.refreshTable();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'black',
          `${action === 'add' ? 'Agregado' : 'Editado'} correctamente...!!!`,
          'bottom',
          'center'
        );
      }
    });
  }

  private updateRecord(updatedRecord: empleadosModel) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id_empleado === updatedRecord.id_empleado
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      `${totalSelect} registro(s) eliminado(s) correctamente...!!!`,
      'bottom',
      'center'
    );
  }

  loadData() {
    this.isLoading = true;

    this.EmpleadosService.getEmpleados("").subscribe({
      next: (data) => {
        this.data = data;
        this.dataSource = new MatTableDataSource<empleadosModel>(this.data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;

        this.dataSource.filterPredicate = (data: empleadosModel, filter: string) => {
          const dataStr = Object.values(data)
            .filter(value => value !== null && value !== undefined)
            .map(value => value.toString().toLowerCase())
            .join(' ');
          return dataStr.indexOf(filter) !== -1;
        };

        this.refreshTable();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.showNotification(
          'snackbar-danger',
          'Error al cargar los empleados',
          'bottom',
          'center'
        );
      },
    });
  }

  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';
    // Eliminar guiones y espacios
    return phoneNumber.replace(/^\-+|\-+/g, '');
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
    const exportData = this.dataSource.filteredData.map((x) => ({
      'ID': x.id_empleado,
      'Nombre': x.s_nombre,
      'Apellido Paterno': x.s_apellido_paterno,
      'Apellido Materno': x.s_apellido_materno,
      'Tipo': x.s_tipo_empleado,
      'Sucursal': x.s_sucursal,
      'Teléfono': this.formatPhoneNumber(x.n_telefono),
      'Correo': x.s_correo,
      'Estatus': x.b_activo ? 'Activo' : 'Inactivo'
    }));

    TableExportUtil.exportToExcel(exportData, 'empleados');
  }

  onContextMenu(event: MouseEvent, item: empleadosModel) {
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
