import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule, MatHeaderCell, MatCell } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { rowsAnimation, TableExportUtil } from '@shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule, MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule, MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { HttpClient } from '@angular/common/http';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Direction } from '@angular/cdk/bidi';





import { clientesModel } from 'app/models/clientesModel'
import { conexion } from 'app/conexion';
import { ClientesService } from 'app/services/clientes/clientes.service';
import { DiaologCrearClienteComponent } from './dialog/diaolog-crear-cliente/diaolog-crear-cliente.component';

@Component({
  selector: 'app-clientes',
  imports: [
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
    MatPaginator,
    MatProgressSpinner,
    MatHeaderCell,
    MatCell,
    BreadcrumbComponent, MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FeatherIconsComponent,
    MatCheckbox
],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit, OnDestroy, AfterViewInit {

  // Definición de columnas
  columnDefinitions = [
    { def: 'id_cliente', label: 'ID', type: 'idTabla', visible: true },
    { def: 's_nombre_cliente', label: 'Nombre', type: 'text', visible: true },
    { def: 's_numero_telefono', label: 'Teléfono', type: 'phone', visible: true },
    { def: 'id_tipo_cliente', label: 'Tipo de cliente', type: 'text', visible: true },
    { def: 's_correo', label: 'Correo', type: 'email', visible: true },
    { def: 'b_activo', label: 'Estatus', type: 'text', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true }
  ];


  dataSource = new MatTableDataSource<clientesModel>();
  selection = new SelectionModel<clientesModel>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  clientesModel: clientesModel[] = [];
  data: any;
  ruta_img: string = conexion.ruta_img_front + "clientes/";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter: ElementRef | undefined;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Clientes',
      items: ['Home'],
      active: 'Clientes',
    },
  ];


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public ClientesService: ClientesService,
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

  addNew() {
    this.openDialog('add');
  }

  openDialog(action: 'add' | 'edit', data?: clientesModel) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DiaologCrearClienteComponent, {
      width: '60vw',
      maxWidth: '100vw',
      panelClass: 'custom-dialog-container',
      data: { clientesModel: data, action },
      direction: varDirection,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Actualizamos la tabla después de cerrar el dialog
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
          `${action === 'add' ? 'Nuevo cliente agregado' : 'Cliente actualizado'} correctamente`,
          'bottom',
          'center'
        );
      }
    });
  }



  editCall(row: clientesModel) {
    this.openDialog('edit', row);
  }




  private updateRecord(updatedRecord: clientesModel) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id_cliente === updatedRecord.id_cliente
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
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }


loadData() {
  this.isLoading = true;

  this.ClientesService.getClientes("").subscribe({
    next: (resp: any) => {
      this.dataSource.data = resp.data ?? [];
      this.isLoading = false;
      console.log('Clientes:', this.dataSource.data);
    },
    error: () => {
      this.isLoading = false;
    }
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





}
