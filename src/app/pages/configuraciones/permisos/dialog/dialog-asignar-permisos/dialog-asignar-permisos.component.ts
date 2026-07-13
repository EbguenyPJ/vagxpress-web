import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PermisosService } from 'app/services/permisos/permisos.service';
import { UsuariosService } from 'app/services/usuarios/usuarios.service';
import { CatalogosService } from 'app/services/catalogos/catalogos.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-dialog-asignar-permisos',
  imports: [ CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatDialogClose,
    MatDialogActions,
    FormsModule,
    MatDialogModule,
    MatSelectModule],
  templateUrl: './dialog-asignar-permisos.component.html',
  styleUrl: './dialog-asignar-permisos.component.scss'
})
export class DialogAsignarPermisosComponent implements OnInit {
  isLoading = true;
  isSaving = false;
  modulos: any[] = [];
  modulosUsuario: number[] = [];
  usuario: any;
  categorias: any[] = [];
  mensaje = '';
  mensajeColor = 'primary';
  tiposUsuarios: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<DialogAsignarPermisosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: any },
    private permisosService: PermisosService,
    private usuariosService: UsuariosService,
    private catalogosService: CatalogosService,
    private snackBar: MatSnackBar,
  ) {
    this.usuario = data.usuario;

  }

  ngOnInit(): void {
    this.cargarModulosDisponibles();
    this.cargarTiposUsuarios();
    
  }


   guardarPermisos(): void {
    this.isSaving = true;
    this.mensaje = 'Guardando cambios...';
    this.mensajeColor = 'accent';

    this.permisosService.actualizarModulosUsuario(this.usuario.id,
      this.modulosUsuario
    ).subscribe({
      next: (response: any) => {
        this.isSaving = false;
        // Verificación segura de respuesta exitosa
        const success = response &&
          (response.status === 'success' ||
            response.success ||
            (response.code && response.code === 200));

        if (success) {
          this.mensaje = 'Permisos actualizados correctamente';
          this.mensajeColor = 'primary';
          Swal.fire({
            title: '¡Éxito!',
            text: 'Los permisos se han actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.dialogRef.close('reload');
          });
        } else {
          const errorMsg = response && response.message ? response.message : 'Error al actualizar permisos';
          this.manejarError(null, errorMsg);
        }
      },
      error: (error: any) => this.manejarError(error, 'Error al guardar cambios')
    });
  }



cargarModulosDisponibles(): void {
    this.isLoading = true;
    this.mensaje = 'Cargando módulos disponibles...';

    this.permisosService.getModulosDisponibles()
      .subscribe({
        next: (response: any) => {
          // Manejo seguro de la respuesta sin asumir estructura
          if (Array.isArray(response)) {
            this.modulos = response;
          } else if (response && typeof response === 'object') {
            this.modulos = response.data || [];
          } else {
            this.modulos = [];
          }

          this.categorias = this.extraerCategorias(this.modulos);
          this.cargarModulosUsuario();
        },
        error: (error: any) => this.manejarError(error, 'Error al cargar módulos disponibles')
      });
  }

  cargarModulosUsuario(): void {
    this.mensaje = 'Cargando permisos actuales...';
    this.permisosService.getModulosUsuario(this.usuario.id)
      .subscribe({
        next: (response: any) => {
          let modulosUsuario: any[] = [];
          if (Array.isArray(response)) {
            modulosUsuario = response;
          } else if (response && typeof response === 'object') {
            modulosUsuario = response.data || [];
          }

          this.modulosUsuario = modulosUsuario.map((modulo: any) => modulo.id_modulo || modulo.id);
          this.isLoading = false;
          this.mensaje = '';
        },
        error: (error: any) => this.manejarError(error, 'Error al cargar permisos del usuario')
      });
  }


   manejarError(error: any, mensajeDefault: string): void {
    this.isLoading = false;
    this.isSaving = false;

    const mensajeError = error?.error?.message || error?.message || mensajeDefault;

    this.mensaje = mensajeError;
    this.mensajeColor = 'warn';

    console.error('Error:', error);
    Swal.fire({
      title: 'Error',
      text: mensajeError,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }



  extraerCategorias(modulos: any[]): any[] {
    const categoriasUnicas: any[] = [];
    const idsCategorias = new Set<number>();

    modulos.forEach((modulo: any) => {
      if (modulo.id_categoria_modulo && !idsCategorias.has(modulo.id_categoria_modulo)) {
        idsCategorias.add(modulo.id_categoria_modulo);
        categoriasUnicas.push({
          id: modulo.id_categoria_modulo,
          nombre: modulo.s_categoria_modulo || 'Sin categoría'
        });
      }
    });

    return categoriasUnicas;
  }

  getModulosPorCategoria(idCategoria: number): any[] {
    return this.modulos.filter((modulo: any) => modulo.id_categoria_modulo === idCategoria);
  }

  moduloEstaActivo(idModulo: number): boolean {
    return this.modulosUsuario.includes(idModulo);
  }

  toggleModulo(idModulo: number, event: any): void {
    const checked = event.checked;

    if (checked) {
      if (!this.modulosUsuario.includes(idModulo)) {
        this.modulosUsuario.push(idModulo);
      }
    } else {
      this.modulosUsuario = this.modulosUsuario.filter((id: number) => id !== idModulo);
    }
  }


  // Notificación
  showNotification(
    colorName: string,
    text: string,
    placementFrom: 'top' | 'bottom',
    placementAlign: 'start' | 'center' | 'end'
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }



// Actualizar estatus
  actualizarEstatus(usuario: any, event: any) {
    const checked = event.checked ? 1 : 0;
    const id_usuario = usuario.id; //  

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a ${checked ? 'activar' : 'desactivar'} este usuario.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        usuario.loading = true;

        // Pasa el token real y el body con b_activo
        this.usuariosService.actualizarEstatus(usuario.id, checked ? 1 : 0)
          .subscribe({
            next: (response: any) => {
              if (response && response.status === 'success') {
                usuario.b_activo = checked; // Actualiza el toggle
                this.showNotification('snackbar-success', `Usuario ${checked ? 'activado' : 'desactivado'} correctamente`, 'bottom', 'center');
              } else {
                usuario.b_activo = checked ? 0 : 1; // Revertir toggle en caso de error
                this.showNotification('snackbar-danger', 'Error al actualizar el estado del usuario', 'bottom', 'center');
              }
              usuario.loading = false;
            },
            error: () => {
              usuario.b_activo = checked ? 0 : 1; // Revertir toggle si falla
              usuario.loading = false;
              this.showNotification('snackbar-danger', 'Error en la solicitud', 'bottom', 'center');
            }
          });
      } else {
        event.source.checked = !event.checked; // Revertir toggle si cancela
      }
    });
  }


  
// Cambiar tipo de usuario

  actualizarTipoUsuario(usuario: any, event: any) {
    const nuevoTipoId = event.value; // Valor seleccionado en el mat-select
    const tipoSeleccionado = this.tiposUsuarios.find(t => t.id_tipo_usuario === nuevoTipoId);
    const nuevoTipoNombre = tipoSeleccionado ? tipoSeleccionado.s_tipo_usuario : nuevoTipoId;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a cambiar el tipo de usuario a "${nuevoTipoNombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        usuario.loading = true;

        this.usuariosService.actualizarTipoUsuario(usuario.id, nuevoTipoId)
          .subscribe({
            next: (response: any) => {
              usuario.loading = false;

              if (response && response.status === 'success') {
                usuario.id_tipo_usuario = nuevoTipoId; // Actualiza localmente
                this.showNotification(
                  'snackbar-success',
                  'Tipo de usuario actualizado correctamente',
                  'bottom',
                  'center'
                );
              } else {
                this.showNotification(
                  'snackbar-danger',
                  'Error al actualizar el tipo de usuario',
                  'bottom',
                  'center'
                );
              }
            },
            error: (err: any) => {
              usuario.loading = false;
              this.showNotification(
                'snackbar-danger',
                'Error en la solicitud',
                'bottom',
                'center'
              );
            }
          });
      } else {
        // Revertir selección si canceló
        event.source.value = usuario.id_tipo_usuario;
      }
    });
  }


  
// Cargar tipos de usuariosß
  cargarTiposUsuarios() {
    this.catalogosService.obtener('tipos-usuarios').subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.data)) {
          this.tiposUsuarios = res.data; // Aquí tomamos data de la API
        } else {
          this.tiposUsuarios = [];
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los tipos de usuario', 'error');
      }
    });
  }






// Cargar tipos de usuariosß




}
