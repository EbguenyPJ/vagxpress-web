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
import { ClientesService } from 'app/services/clientes/clientes.service';
import { CommonModule } from '@angular/common';//Para que funcione ngFor en Angular 19
import { conexion } from 'app/conexion';
import Swal from 'sweetalert2';
import { DialogData } from 'app/contacts/form/form.component';
import { clientesModel } from 'app/models/clientesModel';

@Component({
  selector: 'app-diaolog-crear-cliente',
  imports: [MatButtonModule,
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
    MatCheckboxModule],
  templateUrl: './diaolog-crear-cliente.component.html',
  styleUrl: './diaolog-crear-cliente.component.scss'
})
export class DiaologCrearClienteComponent {
  action: string;
  dialogTitle: string;
  clientesForm: FormGroup;
  clientesModel: clientesModel;
  tiposClientes: any;
  imagenBase64: string | null = null;
  selectedFileName: string = '';
  ruta_img: any = conexion.url_img + "/empleados/";
  actualizarImagen: boolean = false;
  url: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DiaologCrearClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ClienteService: ClientesService,
    private fb: FormBuilder
  ) {
    this.action = data?.action;

    if (this.action === 'edit') {
      this.dialogTitle = data.clientesModel.s_nombre_cliente;
      this.clientesModel = new clientesModel(data.clientesModel);
    } else {
      this.dialogTitle = 'Registrar cliente';
      this.clientesModel = new clientesModel();
    }

    this.clientesForm = this.createClienteForm();
    this.getTiposClientes();
  }

  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    //If ternario
    return this.formControl.hasError('required') ? 'Required field' : this.formControl.hasError('email') ? 'Not a valid email' : '';
  }


  createClienteForm(): FormGroup {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');

    return this.fb.group({
      s_nombre_cliente: [
        this.clientesModel.s_nombre_cliente,
        [Validators.required]
      ],
      s_razon_social: [
        this.clientesModel.s_razon_social
      ],
      s_rfc: [
        this.clientesModel.s_rfc
      ],
      s_ine: [
        this.clientesModel.s_ine
      ],
      s_numero_telefono: [
        this.clientesModel.s_numero_telefono,
        [Validators.required, Validators.pattern('^[0-9]*$')]
      ],
      s_correo: [
        this.clientesModel.s_correo,
        [Validators.email]
      ],
      id_tipo_cliente: [
        this.clientesModel.id_tipo_cliente,
        [Validators.required]
      ],

      // 
      id_usuario_crea: [
        auth.id_usuario,
        
      ]
    });
  }





  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
  if (this.clientesForm.invalid) {
    Swal.fire('Error', 'Complete los campos requeridos', 'error');
    return;
  }

  const formData = this.clientesForm.getRawValue();

  // Limpiar teléfono
  formData.s_numero_telefono = formData.s_numero_telefono?.toString().replace(/\D/g, '');

  // Si estamos editando, asignamos id_usuario_modifica
  if (this.action === 'edit') {
    formData.id_usuario_modifica = Number(localStorage.getItem('id_usuario')) || 1;
  } else {
    // Para creación, usamos id_usuario_crea
    formData.id_usuario_crea = Number(localStorage.getItem('id_usuario')) || 1;
  }

  const request = this.action === 'edit'
    ? this.ClienteService.actualizarCliente('', this.clientesModel.id_cliente, formData)
    : this.ClienteService.crearCliente('', formData);

  request.subscribe({
    next: (resp) => {
      Swal.fire(
        'Éxito',
        `Cliente ${this.action === 'edit' ? 'actualizado' : 'creado'} correctamente`,
        'success'
      );
      this.dialogRef.close(resp);
    },
    error: (err) => {
      console.error('ERROR DETALLE:', err);
      Swal.fire(
        'Error',
        err.error?.message || 'Error al guardar cliente',
        'error'
      );
    }
  });
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

  getTiposClientes() {
    this.ClienteService.GetAll('', 'tipos-cliente').subscribe(data => {
      this.tiposClientes = data;
      this.tiposClientes = this.tiposClientes.data;
      console.log("Tipos de clientes: ", this.tiposClientes);
    }


    )
  }
}
