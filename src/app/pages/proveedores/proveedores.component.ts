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



import { ProveedoresService } from 'app/services/proveedores/proveedores.service';
import { conexion } from 'app/conexion';
import { DialogCrearProveedorComponent } from './dialog/dialog-crear-proveedor/dialog-crear-proveedor.component';

@Component({
  selector: 'app-proveedores',
  imports: [BreadcrumbComponent,
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
    MatPaginatorModule,],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss'
})
export class ProveedoresComponent implements OnInit, OnDestroy {


  columnDefinitions = [
    { def: 'id_proveedor', label: 'ID', type: 'idTabla', visible: true },
    { def: 's_proveedor', label: 'Proveedor', type: 'text', visible: true },
    { def: 's_nombre_contacto', label: 'Contacto', type: 'text', visible: true },
    { def: 's_telefono', label: 'Teléfono', type: 'phone', visible: true },
    { def: 's_rfc', label: 'RFC', type: 'text', visible: true },
    { def: 'b_activo', label: 'Estatus', type: 'text', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true }

  ];

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isLoading = true;
  private destroy$ = new Subject<void>();
  data: any;
  ruta_img: any = conexion.url_img + "/proveedores/";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter: ElementRef | undefined;



  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public ProveedoresService: ProveedoresService,
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

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }



  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';
    return phoneNumber.replace(/[^0-9]/g, ''); // elimina letras o guiones
  }

  loadData() {
    this.isLoading = true;

    this.ProveedoresService.getProveedores("").subscribe({
      next: (res) => {
        console.log('Respuesta del API:', res);
        this.data = res;
        this.dataSource = new MatTableDataSource<any>(this.data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;

        // Filtro global
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const dataStr = Object.values(data)
            .filter(v => v !== null && v !== undefined)
            .map(v => v.toString().toLowerCase())
            .join(' ');
          return dataStr.indexOf(filter) !== -1;
        };
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.showNotification('snackbar-danger', 'Error al cargar los proveedores', 'bottom', 'center');
      },
    });
  }


  addNew() {
    this.openDialog('add');
  }

  editCall(row: any) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: any) {
    let varDirection: Direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';

    const dialogRef = this.dialog.open(DialogCrearProveedorComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { proveedor: data, action },
      direction: varDirection,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refresh(); // Siempre recarga los datos

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

  private updateRecord(updatedRecord: any) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id_proveedor === updatedRecord.id_proveedor
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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


}
