import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { UsuariosService } from 'app/services/usuarios/usuarios.service';
import { EmpleadosService } from 'app/services/empleados/empleados.service';
import { conexion } from 'app/conexion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-perfil-usuario',
  templateUrl: './dialog-perfil-usuario.component.html',
  styleUrls: ['./dialog-perfil-usuario.component.scss'],
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    CommonModule,
    MatDialogContent,
    MatDialogClose,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatSelectModule
  ]
})
export class DialogPerfilUsuarioComponent {
  dialogTitle = "Perfil de usuario";
  dataUsuario: any[] = [];
  ruta_img = conexion.url_img + "/empleados/";
  perfilForm: FormGroup;
  nivelesDominio: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  habilidadesOriginales: any[] = [];
  habilidadesEditadas: boolean = false;
  actualizarImagen = false;
  fotoSeleccionada: File | null = null;
  fotoPreview: string | ArrayBuffer | null = null;
  imagenBase64: string | null = null;
  actualizando = false;
  habilidadesEmpleado: any[] = [];
  selectedFileName: string | null = null;
  url: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DialogPerfilUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private empleadosService: EmpleadosService
  ) {
    this.perfilForm = this.fb.group({
      n_telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      n_telefono_contacto_emergencia: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      s_correo: ['', [Validators.email]],
      s_direccion: [''],
      s_nombre: [{ value: '', disabled: true }],
      s_apellido_paterno: [{ value: '', disabled: true }],
      s_apellido_materno: [{ value: '', disabled: true }],
      s_tipo_empleado: [{ value: '', disabled: true }],
      s_sucursal: [{ value: '', disabled: true }],
      d_fecha_ingreso: [{ value: '', disabled: true }],
      s_foto_empleado: [null]
    });

    this.getUsuarioInfo();
  }

  getEmpleadoImage(imageName: string): string {
    return imageName ? `${this.ruta_img}${imageName}` : `${this.ruta_img}empleado-default.png`;
  }

  async getUsuarioInfo() {
    try {
      const data = await this.usuariosService.getPerfilUsuario('', this.dataDialog.id_usuario).toPromise();
      if (data && Array.isArray(data)) {
        this.dataUsuario = data;
        const empleado = this.dataUsuario[0];
        if (empleado) {
          this.perfilForm.patchValue({
            n_telefono: empleado.n_telefono,
            n_telefono_contacto_emergencia: empleado.n_telefono_contacto_emergencia,
            s_correo: empleado.s_correo || empleado.email,
            s_direccion: empleado.s_direccion,
            s_nombre: empleado.s_nombre,
            s_apellido_paterno: empleado.s_apellido_paterno,
            s_apellido_materno: empleado.s_apellido_materno,
            s_tipo_empleado: empleado.s_tipo_empleado,
            s_sucursal: empleado.s_sucursal,
            d_fecha_ingreso: empleado.d_fecha_ingreso,
            s_foto_empleado: empleado.s_foto_empleado || null
          });

          if (empleado.id_empleado) {
            this.getHabilidadesEmpleado(empleado.id_empleado);
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener información:', error);
      Swal.fire('Error', 'No se pudo cargar la información del usuario', 'error');
    }
  }

  getHabilidadesEmpleado(id_empleado: number) {
    this.empleadosService.getHabilidadesEmpleado('', id_empleado).subscribe(
      (response: any) => {
        if (response.status === 'success' && response.data) {
          this.habilidadesEmpleado = response.data.map((h: any) => ({
            ...h,
            n_nivel_dominio: Number(h.n_nivel_dominio) || 1
          }));
          this.habilidadesOriginales = JSON.parse(JSON.stringify(this.habilidadesEmpleado));
        }
      },
      (error: any) => {
        console.log('Error al obtener habilidades:', error);
      }
    );
  }

  getNivelHabilidadPorcentaje(nivel: number): number {
    return nivel * 10;
  }

  // Método para manejar cambios en el nivel de habilidad
  onSkillLevelChange(habilidad: any): void {
    const habilidadOriginal = this.habilidadesOriginales.find(
      h => h.id_habilidad_empleado === habilidad.id_habilidad_empleado
    );

    this.habilidadesEditadas = this.habilidadesEmpleado.some(h => {
      const original = this.habilidadesOriginales.find(
        ho => ho.id_habilidad_empleado === h.id_habilidad_empleado
      );
      return original && original.n_nivel_dominio !== h.n_nivel_dominio;
    });
  }

  getSexoText(id: number | undefined): string {
    if (id === 1) return 'Hombre';
    if (id === 2) return 'Mujer';
    return 'No especificado';
  }

  onFotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fotoSeleccionada = file;
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.fotoPreview = reader.result;
        this.imagenBase64 = reader.result as string;
        this.actualizarImagen = true;
      };
    }
  }

  async submit() {
    if (this.perfilForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const empleado = this.dataUsuario[0];
    if (!empleado || !empleado.id_empleado) {
      Swal.fire('Error', 'No se encontró información del empleado', 'error');
      return;
    }

    this.actualizando = true;

    try {
      // Preparar datos para actualizar
      const formData: any = {
        n_telefono: this.perfilForm.get('n_telefono')?.value?.toString() || '',
        n_telefono_contacto_emergencia: this.perfilForm.get('n_telefono_contacto_emergencia')?.value?.toString() || '',
        s_correo: this.perfilForm.get('s_correo')?.value || '',
        s_direccion: this.perfilForm.get('s_direccion')?.value || ''
      };

      // Manejo de imagen
      if (this.actualizarImagen) {
        formData.s_foto_empleado = this.imagenBase64 || null;
      }

      // 1. Actualizar información personal
      const response = await this.empleadosService.actualizarEmpleado(
        "",
        empleado.id_empleado,
        formData
      ).toPromise();

      // 2. Actualizar habilidades si hay cambios
      if (this.habilidadesEditadas) {
        await this.actualizarHabilidades(empleado.id_empleado);
      }

      Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
      this.dialogRef.close(response);
      window.location.reload();
      this.getUsuarioInfo();
    } catch (error: unknown) {
      let errorMessage = 'Error al actualizar el perfil';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'error' in error) {
        const err = error as { error?: { message?: string } };
        errorMessage = err.error?.message || errorMessage;
      }
      Swal.fire('Error', errorMessage, 'error');
      console.error('Error completo:', error);
    } finally {
      this.actualizando = false;
    }
  }

  private async actualizarHabilidades(idEmpleado: number): Promise<void> {
    const habilidadesActualizadas = this.habilidadesEmpleado.map(h => ({
      id_habilidad_empleado: h.id_habilidad_empleado,
      id_empleado: idEmpleado,
      id_habilidad: h.id_habilidad,
      n_nivel_dominio: h.n_nivel_dominio
    }));

    try {
      await this.empleadosService.actualizarHabilidadesEmpleado(
        "",
        idEmpleado,
        habilidadesActualizadas
      ).toPromise();

      this.habilidadesEditadas = false;
      this.habilidadesOriginales = JSON.parse(JSON.stringify(this.habilidadesEmpleado));

      Swal.fire('Éxito', 'Habilidades actualizadas correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar habilidades:', error);
      Swal.fire('Error', 'No se pudieron actualizar las habilidades', 'error');
      throw error;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}