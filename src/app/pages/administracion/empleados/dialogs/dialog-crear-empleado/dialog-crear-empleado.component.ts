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
import { MatCheckboxModule } from '@angular/material/checkbox';

//Agregados
import { empleadosModel } from 'app/models/empleadosModel';
import { EmpleadosService } from 'app/services/empleados/empleados.service';
//import { CatalogosService } from 'app/services/catalogos/catalogos.service';
import { CatalogosService } from 'app/services/catalogos/catalogos.service';
import { CommonModule } from '@angular/common';//Para que funcione ngFor en Angular 19
import { conexion } from 'app/conexion';
import Swal from 'sweetalert2';



export interface DialogData {
  id: number;
  action: string;
  empleadosModel: empleadosModel;
}

@Component({
  selector: 'app-dialog-crear-empleado',
  templateUrl: './dialog-crear-empleado.component.html',
  styleUrl: './dialog-crear-empleado.component.scss',
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
    MatCheckboxModule
  ]
})
export class DialogCrearEmpleadoComponent {
  action: string;
  dialogTitle: string;
  empleadosForm: FormGroup;
  empleadosModel: empleadosModel;
  imagenBase64: string | null = null;
  selectedFileName: string = '';
  ruta_img: any = conexion.url_img + "/empleados/";
  actualizarImagen: boolean = false;
  url: string | null = null;
  // Variables globales
  tiposEmpleados: any;
  profesiones: any;
  gradosEstudios: any;
  sucursales: any;
  generos: any;
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<DialogCrearEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public EmpleadosService: EmpleadosService,
    public CatalogosService: CatalogosService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.empleadosModel.s_nombre;
      this.empleadosModel = data.empleadosModel;
    } else {
      this.dialogTitle = 'Registrar empleado';
      this.empleadosModel = new empleadosModel();
    }

    this.empleadosForm = this.createContactForm();
    this.getTiposEmpleados();
    this.getProfesiones();
    this.getGradosEstudios();
    this.getSucursales();
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
      id_tipo_empleado: [this.empleadosModel.id_tipo_empleado || null, [Validators.required]],
      id_profesion: [this.empleadosModel.id_profesion || null],
      id_grado_estudios: [this.empleadosModel.id_grado_estudios || null],
      id_sucursal: [this.empleadosModel.id_sucursal || null, [Validators.required]],
      id_sexo: [this.empleadosModel.id_sexo ? Number(this.empleadosModel.id_sexo) : 1, [Validators.required]],
      s_nombre: [this.empleadosModel.s_nombre || '', [Validators.required]],
      s_apellido_paterno: [this.empleadosModel.s_apellido_paterno || '', [Validators.required]],
      s_apellido_materno: [this.empleadosModel.s_apellido_materno || ''],
      s_foto_empleado: [this.empleadosModel.s_foto_empleado || null],
      s_telefono: [this.empleadosModel.s_telefono || '', [Validators.required, Validators.pattern('^[0-9]*$')]],
      s_telefono_contacto_emergencia: [this.empleadosModel.s_telefono_contacto_emergencia || null],
      s_correo: [this.empleadosModel.s_correo || '', [Validators.required, Validators.email, Validators.minLength(5)]],
      s_direccion: [this.empleadosModel.s_direccion || ''],
      d_fecha_nacimiento: [
        this.action === 'edit'
          ? this.toDateInputValue(this.empleadosModel.d_fecha_nacimiento)
          : this.toDateInputValue(new Date(new Date().setFullYear(new Date().getFullYear() - 25)))
      ],
      d_fecha_ingreso: [
        this.action === 'edit'
          ? this.toDateInputValue(this.empleadosModel.d_fecha_ingreso)
          : this.toDateInputValue(new Date())
      ]

    });
  }

  private toDateInputValue(date: any): string | null {
    if (!date) return null;

    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${d.getFullYear()}-${month}-${day}`;
  }




  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    if (this.empleadosForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const formData = this.empleadosForm.getRawValue();

    console.log(' FORM DATA ORIGINAL:', JSON.parse(JSON.stringify(formData)));

    // Preparar datos para enviar
    if (this.action === 'edit') {
      // Para edición:
      if (this.actualizarImagen) {
        // Si se marcó actualizar imagen, enviar la nueva o null si no hay
        formData.s_foto_empleado = this.imagenBase64 || null;
      } else {
        // Si no se marcó actualizar, no enviar el campo
        delete formData.s_foto_empleado;
      }
    } else {
      // Para creación, usar la imagen subida o null (que pondrá default)
      formData.s_foto_empleado = this.imagenBase64 || null;
    }

    // Limpiar número de teléfono
    if (formData.s_telefono) {
      formData.s_telefono = formData.s_telefono.toString().replace(/\D/g, '');
    }

    if (formData.s_telefono_contacto_emergencia) {
      formData.s_telefono_contacto_emergencia =
        formData.s_telefono_contacto_emergencia.toString().replace(/\D/g, '');
    }

    // Formatear fechas (IMPORTANTE)
    formData.d_fecha_nacimiento = new Date(formData.d_fecha_nacimiento).toISOString().split('T')[0];
    formData.d_fecha_ingreso = new Date(formData.d_fecha_ingreso).toISOString().split('T')[0];

    console.log('🚀 FORM DATA FINAL (ENVÍO A API):', JSON.parse(JSON.stringify(formData)));

    const serviceCall = this.action === 'edit'
      ? this.EmpleadosService.actualizarEmpleado("", this.empleadosModel.id_empleado, formData)
      : this.EmpleadosService.crearEmpleado("", formData);

    serviceCall.subscribe({
      next: (response) => {
        console.log(' RESPUESTA API:', response);
        Swal.fire(
          'Éxito',
          `Empleado ${this.action === 'edit' ? 'actualizado' : 'creado'} correctamente`,
          'success'
        );
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error(' ERROR API COMPLETO:', error);
        console.error('ERROR BODY:', error.error);

        let errorMessage =
          error.error?.message ||
          error.message ||
          `Ocurrió un error al ${this.action === 'edit' ? 'actualizar' : 'crear'} el empleado`;

        Swal.fire('Error', errorMessage, 'error');
      }
    });



    // if (this.empleadosForm.valid) {
    //   const formData = this.empleadosForm.getRawValue();

    //   if (this.action === 'edit') {
    //     // Update existing leave request

    //     this.UsuariosService.updateempleadosModel(formData).subscribe({
    //       next: (response) => {
    //         // console.log('Update Response:', response);
    //         this.dialogRef.close(response); // Close with the response data
    //       },
    //       error: (error) => {
    //         console.error('Update Error:', error);
    //         // Handle error if necessary
    //       },
    //     });
    //   } else {
    //     // Add new leave request
    //     this.UsuariosService.addempleadosModel(formData).subscribe({
    //       next: (response) => {
    //         // console.log('Add Response:', response);
    //         this.dialogRef.close(response); // Close with the response data
    //       },
    //       error: (error) => {
    //         console.error('Add Error:', error);
    //         // Handle error if necessary
    //       },
    //     });
    //   }
    // }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.url = reader.result as string;
        this.imagenBase64 = reader.result as string;
        this.empleadosForm.patchValue({
          s_foto_empleado: this.imagenBase64
        });
      };
    }
  }

  soloNumeros(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Solo permitir números (0-9)
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // --------------------- Obtener Catalogos ---------------------//

  getTiposEmpleados() {
    this.CatalogosService.GetAll('', 'tipos-empleados').subscribe(data => {
      this.tiposEmpleados = data;
      this.tiposEmpleados = this.tiposEmpleados.data;
      console.log("Tipos de empleados: ", this.tiposEmpleados);
    }


    )
  }

  async getProfesiones() {
    this.CatalogosService.GetAll('', 'profesiones').subscribe(data => {
      this.profesiones = data;
      this.profesiones = this.profesiones.data;
      console.log("Tipos profesiones: ", this.profesiones);
    },

      error => {
        console.log('oops', error)
        // Swal.fire('Catálogo Municipios no funciona','Consulte con el administrador', 'warning');
      }
    )
  }

  async getGradosEstudios() {
    this.CatalogosService.GetAll('', 'grados-estudios').subscribe(data => {
      this.gradosEstudios = data;
      this.gradosEstudios = this.gradosEstudios.data;
      console.log("Grados estudios: ", this.gradosEstudios);
    },

      error => {
        console.log('oops', error)
        // Swal.fire('Catálogo Municipios no funciona','Consulte con el administrador', 'warning');
      }
    )
  }

  async getSucursales() {
    this.CatalogosService.GetAll('', 'sucursales').subscribe(data => {
      this.sucursales = data;
      this.sucursales = this.sucursales.data;
      console.log("Sucursales: ", this.sucursales);
    },

      error => {
        console.log('oops', error)
        // Swal.fire('Catálogo Municipios no funciona','Consulte con el administrador', 'warning');
      }
    )
  }


}//End class
