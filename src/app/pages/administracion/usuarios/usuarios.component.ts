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

//Agregados
import { usuariosModel } from 'app/models/usuariosModel';
import { UsuariosService } from './../../../services/usuarios/usuarios.service';
import { DialogCrearUsuarioComponent } from './dialogs/dialog-crear-usuario/dialog-crear-usuario.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
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
  ]
})

export class UsuariosComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    //{ def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id', label: 'ID', type: 'number', visible: true },
    { def: 'name', label: 'Usuario', type: 'text', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 's_nombre_completo', label: 'Nombre', type: 'text', visible: true },
    { def: 'b_usuario_web', label: 'Acceso Web', type: 'text', visible: true },
    { def: 'b_usuario_movil', label: 'Acceso Móvil', type: 'text', visible: true },
    { def: 'b_activo', label: 'Estatus', type: 'text', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true },
    // { def: 'mobile', label: 'Mobile', type: 'phone', visible: true },
    // { def: 'address', label: 'Address', type: 'address', visible: true },
    // { def: 'country', label: 'Country', type: 'text', visible: true },
  ];

  dataSource = new MatTableDataSource<usuariosModel>([]);
  selection = new SelectionModel<usuariosModel>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();
  usuariosModel: usuariosModel[] = [];
  data: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Table',
      items: ['Home'],
      active: 'Table',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    //public usuariosModelService: usuariosModelService,
    public UsuariosService: UsuariosService,
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

  editCall(row: usuariosModel) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: usuariosModel) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DialogCrearUsuarioComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { usuariosModel: data, action },
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
          `${action === 'add' ? 'Add' : 'Edit'} Record Successfully...!!!`,
          'bottom',
          'center'
        );
      }
    });
  }

  private updateRecord(updatedRecord: usuariosModel) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
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
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }

  loadData() {
    this.isLoading = true;

    this.UsuariosService.getUsuarios("").subscribe({
      next: (data) => {
        this.data = data;
        this.dataSource = new MatTableDataSource<usuariosModel>(this.data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("Lista de usuarios: ", this.dataSource);

        this.dataSource.filterPredicate = (data: usuariosModel, filter: string) => {
          const dataStr = Object.values(data)
            .filter(value => value !== null && value !== undefined)
            .map(value => value.toString().toLowerCase())
            .join(' ');
          return dataStr.indexOf(filter) !== -1;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
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
      // 'First Name': x.name,
      // Email: x.email,
      // Gender: x.gender,
      // 'Birth Date': formatDate(new Date(x.birthDate), 'yyyy-MM-dd', 'en') || '',
      // Mobile: x.mobile,
      // Address: x.address,
      // Country: x.country,
    }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  onContextMenu(event: MouseEvent, item: usuariosModel) {
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
