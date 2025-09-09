import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';


import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { rowsAnimation, TableExportUtil } from '@shared';


import { RefaccionesService } from 'app/services/refacciones/refacciones.service';
import { refaccionModel } from 'app/models/refaccionModel';
import { Subject } from 'rxjs';
import { conexion } from 'app/conexion'; // Para la ruta de imágenes

@Component({
  selector: 'app-catalogo-refacciones',
  templateUrl: './catalogoRefacciones.component.html',
  styleUrl: './catalogoRefacciones.component.scss',
  standalone: true,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  animations: [rowsAnimation],
  imports: [
    CommonModule,
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
    MatRippleModule,
  ]
})
export class CatalogoRefaccionesComponent implements OnInit, OnDestroy, AfterViewInit {

  columnDefinitions = [
    { def: 'select', type: 'check', visible: true }, // Opcional: Habilitar si se necesita selección múltiple
    { def: 'id_refaccion',       label: 'ID',        type: 'idTabla', visible: true },
    { def: 's_nombre_refaccion', label: 'Nombre',    type: 'text',    visible: true },
    { def: 's_numero_parte',     label: 'No. Parte', type: 'text',    visible: true },
    { def: 's_marca_refaccion',  label: 'Marca',     type: 'text',    visible: true },
    { def: 'n_precio_venta',     label: 'Precio',    type: 'currency',visible: true },
    { def: 'n_stock_actual',     label: 'Stock',     type: 'number',  visible: true },
    { def: 's_estatus_refaccion',label: 'Estatus',   type: 'status',  visible: true },
    { def: 'actions',            label: 'Acciones',  type: 'actionBtn', visible: true }
  ];

  dataSource = new MatTableDataSource<refaccionModel>();
  selection = new SelectionModel<refaccionModel>(true, []);
  isLoading = true;
  private destroy$ = new Subject<void>();
  data: any;

  // Ruta base para imágenes de refacciones (ajustar si es necesario)
  ruta_img: string = conexion.url_img;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter: ElementRef | undefined;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  breadscrums = [
    {
      title: 'Refacciones',
      items: ['Inventario'],
      active: 'Catálogo',
    },
  ];

  constructor(
    public dialog: MatDialog,
    public refaccionesService: RefaccionesService,
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadData() {
    this.isLoading = true;
    this.refaccionesService.getRefacciones("").subscribe({
      next: (data) => {
        this.data = data;
        this.dataSource.data = this.data.data.map((item: any) => new refaccionModel(item));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;

        this.dataSource.filterPredicate = (data: refaccionModel, filter: string) => {
          const dataStr = Object.values(data)
            .filter(value => value !== null && value !== undefined)
            .map(value => value.toString().toLowerCase())
            .join(' ');
          return dataStr.indexOf(filter) !== -1;
        };
      },
      error: (err) => {
        console.error("Error al cargar refacciones:", err);
        this.isLoading = false;
        this.showNotification('snackbar-danger', 'Error al cargar las refacciones.', 'bottom', 'center');
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
    const exportData = this.dataSource.filteredData.map((x) => ({
      'ID': x.id_refaccion,
      'Nombre': x.s_nombre_refaccion,
      'Numero de Parte': x.s_numero_parte,
      'Marca': x.s_marca_refaccion,
      'Categoria': x.s_categoria_refaccion,
      'Subcategoria': x.s_subcategoria_refaccion,
      'Precio Venta': x.n_precio_venta,
      'Stock': x.n_stock_actual,
      'Estatus': x.s_estatus_refaccion,
    }));
    TableExportUtil.exportToExcel(exportData, 'catalogo_refacciones');
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
    // Implementar lógica de eliminación múltiple si es necesario
    const totalSelect = this.selection.selected.length;
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} registro(s) seleccionados (función de borrado no implementada).`,
      'bottom',
      'center'
    );
  }
}
