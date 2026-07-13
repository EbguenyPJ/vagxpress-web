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





import { refaccionInsertadaModel } from 'app/models/refaccionInsertadaModel';
import { EmbarqueService } from 'app/services/embarque/embarque.service';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DialogRefaccionesInsertadasComponent } from '../dialogs/dialog-refacciones-insertadas/dialog-refacciones-insertadas.component';

@Component({
  selector: 'app-refacciones-insertadas',
  imports: [
    CommonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    FeatherIconsComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
],
  templateUrl: './refacciones-insertadas.component.html',
  styleUrl: './refacciones-insertadas.component.scss',
  animations: [rowsAnimation],
})
export class RefaccionesInsertadasComponent {
  columnDefinitions = [
    { def: 'id_refaccion', label: '#', type: 'idTabla', visible: true },
    { def: 's_nombre_refaccion', label: 'Refaccion', type: 'text', visible: true },
    { def: 's_marca_refaccion', label: 'Marca', type: 'text', visible: true },
    { def: 's_categoria_refaccion', label: 'Categoria', type: 'text', visible: true },
    { def: 's_subcategoria_refaccion', label: 'SubCategoria', type: 'text', visible: true },
    { def: 's_clase_refaccion', label: 'Clase', type: 'text', visible: true },
    { def: 's_numero_parte', label: '#Parte', type: 'text', visible: true },
    { def: 'n_cantidad', label: 'Cantidad', type: 'text', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true },
  ];


  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;




  dataSource = new MatTableDataSource<refaccionInsertadaModel>([]);
  selection = new SelectionModel<refaccionInsertadaModel>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();
  refaccionInsertadaModel: refaccionInsertadaModel[] = [];
  data: any;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter: ElementRef | undefined;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;


  constructor(
        public httpClient: HttpClient,
        public dialog: MatDialog,
        public EmbarqueService: EmbarqueService,
        private snackBar: MatSnackBar,
    ) { }

  ngOnInit() {
    this.loadData();
  }

  applyDateFilter() {
    this.paginator.firstPage();
    this.dataSource.filter = Math.random().toString(); // solo refresca
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
    
  
  addNew() {
    this.openDialog('add');
  }
    
  editCall(row: refaccionInsertadaModel) {
    this.openDialog('edit', row);
  }
    
  openDialog(action: 'add' | 'edit', data?: refaccionInsertadaModel) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DialogRefaccionesInsertadasComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { refaccionInsertadaModel: data, action },
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
    
  private updateRecord(updatedRecord: refaccionInsertadaModel) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id_refaccion === updatedRecord.id_refaccion
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

    this.EmbarqueService.getRefaccionesInsertadas().subscribe({
      next: (data: any) => {
        this.data = data;
        this.dataSource = new MatTableDataSource<refaccionInsertadaModel>(this.data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;

        // this.dataSource.filterPredicate = (data: refaccionInsertadaModel, filter: string) => {
        //   const dataStr = Object.values(data)
        //     .filter(value => value !== null && value !== undefined)
        //     .map(value => value.toString().toLowerCase())
        //     .join(' ');
        //   return dataStr.indexOf(filter) !== -1;
        // };




      this.dataSource.filterPredicate = (data: refaccionInsertadaModel) => {

        /* ===== FILTRO TEXTO INPUT ===== */
        const textoFiltro = (this.filter?.nativeElement.value || '').toLowerCase();

        const cumpleTexto = Object.values(data)
          .filter(v => v !== null && v !== undefined)
          .some(v => v.toString().toLowerCase().includes(textoFiltro));

        if (!cumpleTexto) return false;

        /* ===== FILTRO FECHAS ===== */
        if (!data.d_fecha_creacion) return false;

        const fechaRegistro = new Date(data.d_fecha_creacion);

        if (this.fechaDesde) {
          if (fechaRegistro < this.startOfDay(this.fechaDesde)) return false;
        }

        if (this.fechaHasta) {
          if (fechaRegistro > this.endOfDay(this.fechaHasta)) return false;
        }

        return true;
      };






        

        this.refreshTable();
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
        this.showNotification(
          'snackbar-danger',
          'Error al cargar las refacciones insertadas',
          'bottom',
          'center'
        );
      },
    });
  }


  startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
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
      'ID': x.id_refaccion,
      'Refaccion': x.s_nombre_refaccion,
      'Marca': x.s_marca_refaccion,
      'Categoria': x.s_categoria_refaccion,
      'Subcategoria': x.s_subcategoria_refaccion,
      'Clase': x.s_clase_refaccion,
      '#Parte': x.s_numero_parte,
      'Cantidad': x.n_cantidad
    }));

    TableExportUtil.exportToExcel(exportData, 'refaccionesInsertadas');
  }
    
  onContextMenu(event: MouseEvent, item: refaccionInsertadaModel) {
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
