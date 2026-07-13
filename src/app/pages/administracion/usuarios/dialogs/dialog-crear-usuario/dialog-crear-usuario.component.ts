//import { CatalogosService } from './../../../../../services/catalogos/catalogos.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

//Agregados
import { usuariosModel } from 'app/models/usuariosModel';
import { CatalogosService } from 'app/services/catalogos/catalogos.service';
import { UsuariosService } from 'app/services/usuarios/usuarios.service';
import { EmpleadosService } from 'app/services/empleados/empleados.service';
import { CommonModule } from '@angular/common';//Para que funcione ngFor en Angular 19
import Swal from 'sweetalert2';

export interface DialogData {
  id: number;
  action: string;
  usuariosModel: usuariosModel;
}

@Component({
  selector: 'app-dialog-crear-usuario',
  templateUrl: './dialog-crear-usuario.component.html',
  styleUrl: './dialog-crear-usuario.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
    MatNativeDateModule,
    MatMomentDateModule,
    CommonModule,
  ]
})
export class DialogCrearUsuarioComponent {
  action: string;
  dialogTitle: string;
  usuariosTableForm: FormGroup;
  usuariosModel: usuariosModel;
  url: string | null = null;
  empleados: any;
  hide = true;
  tipos_usuarios: any;

  constructor(
    public dialogRef: MatDialogRef<DialogCrearUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private UsuariosService: UsuariosService,
    private EmpleadosService: EmpleadosService,
    private CatalogosService: CatalogosService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.usuariosModel.name;
      this.usuariosModel = data.usuariosModel;
    } else {
      this.dialogTitle = 'Crear usuario';
      this.usuariosModel = new usuariosModel();
    }

    this.usuariosTableForm = this.createContactForm();
    this.getTiposUsuarios();
    this.getEmpleados();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    //If ternario
    return this.formControl.hasError('required') ? 'Required field' : this.formControl.hasError('email') ? 'Not a valid email' : '';
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      name: [this.usuariosModel.name, [Validators.required]],
      password: [this.usuariosModel.password, [Validators.required]],
      id_empleado: [this.usuariosModel.id_empleado, [Validators.required]],
      id_tipo_usuario: [this.usuariosModel.id_tipo_usuario, [Validators.required]],
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {

    if (this.usuariosTableForm.invalid) {
      Swal.fire('Error', 'Por favor complete los campos requeridos', 'error');
      return;
    }

    const formData = this.usuariosTableForm.getRawValue();
    console.log('DATOS FORMULARIO:', formData);

    this.UsuariosService.registrarUsuario(formData).subscribe({
      next: (response: any) => {
        console.log(' RESPUESTA API:', response);

        Swal.fire({
          title: 'Éxito',
          text: 'Usuario registrado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.dialogRef.close(response);
        });
      },
      error: (error: any) => {
        console.error(' ERROR API:', error);

        const errorMessage =
          error.error?.message ||
          'Ocurrió un error al registrar el usuario';

        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }


  onSelectFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(target.files[0]); // read file as data url

      reader.onload = (e) => {
        if (e.target) {
          this.url = e.target.result as string; // Explicitly cast to avoid undefined
        }
      };
    }
  }



  async getEmpleados() {
    this.EmpleadosService.getEmpleadosSinUsuario().subscribe(data => {
      this.empleados = data;
      this.empleados = this.empleados.data;
      console.log("Lista de empleados: ", this.empleados);
    },

      error => {
        console.log('oops', error)
        // Swal.fire('Catálogo Municipios no funciona','Consulte con el administrador', 'warning');
      }
    )
  }



  async getTiposUsuarios() {
    this.CatalogosService.GetAll('tipos-usuarios').subscribe(data => {
      this.tipos_usuarios = data;
      this.tipos_usuarios = this.tipos_usuarios.data;
      console.log("Tipos de usuarios: ", this.tipos_usuarios);
    },

      error => {
        console.log('oops', error)
        // Swal.fire('Catálogo Municipios no funciona','Consulte con el administrador', 'warning');
      }
    )
  }


}//End class
