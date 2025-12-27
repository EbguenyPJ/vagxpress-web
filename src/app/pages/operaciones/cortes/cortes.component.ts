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
import { cortesModel } from 'app/models/cortesModel';
import { CortesService } from 'app/services/cortes/cortes.service';
import { DialogCrearEmpleadoComponent } from 'app/pages/administracion/empleados/dialogs/dialog-crear-empleado/dialog-crear-empleado.component';
import { conexion } from 'app/conexion';
import { DialogNuevoCorteComponent } from './dialogs/dialog-nuevo-corte/dialog-nuevo-corte.component';
import { DialogDetallesCorteComponent } from './dialogs/dialog-detalles-corte/dialog-detalles-corte.component';

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
    //{ def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id_corte', label: '#', type: 'idTabla', visible: true },
    { def: 'd_fecha_corte', label: 'Fecha', type: 'text', visible: true },
    { def: 'n_monto_total', label: 'Monto Total', type: 'text', visible: true },
    { def: 's_nombre_completo', label: 'Nombre', type: 'text', visible: true },
    { def: 's_descripcion_corte', label: 'Descripción', type: 'text', visible: true }, //
    { def: 'b_activo', label: 'Estatus', type: 'text', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true }
  ];


  dataSource = new MatTableDataSource<cortesModel>([]);
  selection = new SelectionModel<cortesModel>(true, []);
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter: ElementRef | undefined;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public EmpleadosService: EmpleadosService,
    private snackBar: MatSnackBar,
    private cortesService: CortesService
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
    const dialogRef = this.dialog.open(DialogNuevoCorteComponent, {
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

  verDetalle(corte: any) {

    console.log('Ver detalle del corte:', corte);
    let varDirection: Direction =
      localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';

    this.dialog.open(DialogDetallesCorteComponent, {
      width: '60vw',
      maxWidth: '95vw',
      data: {
        id_corte: corte.id_corte
      },
      direction: varDirection,
      autoFocus: false
    });
  }



  private updateRecord(updatedRecord: cortesModel) {
    const index = this.dataSource.data.findIndex(
      (corte) => corte.id_corte === updatedRecord.id_corte
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
    }
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  loadData() {
    this.isLoading = true;
    const token = localStorage.getItem('token') || ''; // tu token si lo usas

    this.cortesService.getCortes(token).subscribe({
      next: (res: any) => { // res es cualquier objeto devuelto por tu API
        this.dataSource.data = res.data || []; // aseguramos que siempre sea un array
        this.isLoading = false;

        // Filtro personalizado para buscar en cualquier campo
        this.dataSource.filterPredicate = (data: cortesModel, filter: string) => {
          const dataStr = Object.values(data)
            .filter(value => value !== null && value !== undefined)
            .map(value => value.toString().toLowerCase())
            .join(' ');
          return dataStr.indexOf(filter) !== -1;
        };
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.showNotification('snackbar-danger', 'Error al cargar los cortes', 'bottom', 'center');
      }
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => cd.visible).map(cd => cd.def);
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      item => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification('snackbar-danger', `${totalSelect} corte(s) eliminado(s) correctamente`, 'bottom', 'center');
  }

  refresh() {
    this.loadData();
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
      panelClass: colorName
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      'ID Corte': x.id_corte,
      'Fecha': x.d_fecha_corte,
      'Monto Total': x.n_monto_total,
      'Descripción': x.s_descripcion_corte,
      'Estatus': x.b_activo ? 'Activo' : 'Inactivo'
    }));
    TableExportUtil.exportToExcel(exportData, 'cortes'); // Implementa tu util de export
  }







}
