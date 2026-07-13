import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import Swal from 'sweetalert2';
import { PermisosService } from 'app/services/permisos/permisos.service';
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { DialogAsignarPermisosComponent } from './dialog/dialog-asignar-permisos/dialog-asignar-permisos.component';

@Component({
  selector: 'app-permisos',
  imports: [BreadcrumbComponent,
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
    MatPaginatorModule, MatSlideToggle],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.scss',
  animations: [rowsAnimation],
})
export class PermisosComponent implements OnInit, AfterViewInit, OnDestroy{

  columnDefinitions = [
    { def: 'id', label: 'ID', type: 'idTabla', visible: true },
    { def: 'name', label: 'Usuario', type: 'text', visible: true },
    { def: 's_nombre_completo', label: 'Nombre', type: 'text', visible: true },
    { def: 'email', label: 'Correo', type: 'email', visible: true },
    //{ def: 'password', label: 'Contraseña', type: 'password', visible: true },
    { def: 'b_activo', label: 'Estatus', type: 'text', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true },
    { def: 'acceso_web', label: 'Web', type: 'switch', visible: true},
    { def: 'acceso_movil', label: 'Móvil', type: 'switch', visible: true }
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
    public PermisosService: PermisosService,
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
    this.UsuariosService.getUsuarios().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.dataSource.data = response.data.map((user: any) => ({
            ...user,
            acceso_web: Number(user.b_usuario_web),   // convertir a número
            acceso_movil: Number(user.b_usuario_movil), // convertir a número
          }));
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(error);
        this.isLoading = false;
        this.showNotification(
          'snackbar-danger',
          'Error al cargar los usuarios',
          'bottom',
          'center'
        );
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


    asignarPermisos(row: any) {
    const dialogRef = this.dialog.open(DialogAsignarPermisosComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { usuario: row }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'reload') {
        this.loadData();
      }
    });
  }



  actualizarModuloWebMovil(row: any, tipo: 'web' | 'movil', event: any) {
    const checked = event.checked ? 1 : 0;
    const id_usuario = row.id;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a ${checked ? 'activar' : 'desactivar'} el acceso ${tipo === 'web' ? 'Web' : 'Móvil'} para este usuario.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar loading en el switch correspondiente
        if (tipo === 'web') {
          row.loading_web = true;
        } else {
          row.loading_movil = true;
        }

        this.UsuariosService.actualizarAccesos(id_usuario, tipo === 'web' ? { b_usuario_web: checked ? 1 : 0 } : { b_usuario_movil: checked ? 1 : 0 })
          .subscribe({
            next: (response: any) => {
              if (response && response.success) {
                this.showNotification(
                  'snackbar-success',
                  `Acceso ${tipo === 'web' ? 'Web' : 'Móvil'} ${checked ? 'activado' : 'desactivado'} correctamente`,
                  'bottom',
                  'center'
                );
              } else {
                this.showNotification(
                  'snackbar-danger',
                  'Error al actualizar el acceso',
                  'bottom',
                  'center'
                );
              }
            },
            error: (error: any) => {
              console.error(error);
              this.showNotification(
                'snackbar-danger',
                'Error al actualizar el acceso',
                'bottom',
                'center'
              );
            },
            complete: () => {
              // Ocultar loading en el switch correspondiente
              if (tipo === 'web') {
                row.loading_web = false;
              } else {
                row.loading_movil = false;
              }
            }
          });
      }
    });
  }


}
