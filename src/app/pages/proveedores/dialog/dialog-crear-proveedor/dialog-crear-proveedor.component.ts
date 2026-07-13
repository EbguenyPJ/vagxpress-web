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
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedoresService } from 'app/services/proveedores/proveedores.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dialog-crear-proveedor',
  imports: [MatButtonModule,
    MatIconModule,
     CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatCheckboxModule],
  templateUrl: './dialog-crear-proveedor.component.html',
  styleUrl: './dialog-crear-proveedor.component.scss'
})
export class DialogCrearProveedorComponent {
  action: string;
  dialogTitle: string;
  proveedoresForm: FormGroup;
  proveedorData: any;
  imagenBase64: string | null = null;
  selectedFileName: string = '';
  ruta_img: string = environment.imgUrl + "/proveedores/";
  actualizarImagen: boolean = false;
  url: string | null = null;




  constructor(
    public dialogRef: MatDialogRef<DialogCrearProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private ProveedoresService: ProveedoresService
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.proveedor.s_proveedor;
      this.proveedorData = { ...data.proveedor };
    } else {
      this.dialogTitle = 'Registrar proveedor';
      this.proveedorData = {};
    }

    this.proveedoresForm = this.createForm();
  }


createForm(): FormGroup {
  return this.fb.group({
    s_proveedor: [this.proveedorData.s_proveedor || '', [Validators.required]],
    s_nombre_contacto: [this.proveedorData.s_nombre_contacto || '', [Validators.required]],
    s_telefono: [this.proveedorData.s_telefono || '', [Validators.required, Validators.pattern('^[0-9]*$')]],
    s_rfc: [this.proveedorData.s_rfc || '', [Validators.required]],
    s_img_proveedor: [this.proveedorData.s_img_proveedor || null]
  });
}


  onNoClick(): void {
    this.dialogRef.close();
  }


  submit() {
    if (this.proveedoresForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const formData = this.proveedoresForm.getRawValue();

    if (this.action === 'edit') {
      if (this.actualizarImagen) {
        formData.s_img_proveedor = this.imagenBase64 || null;
      } else {
        delete formData.s_img_proveedor;
      }
    } else {
      formData.s_img_proveedor = this.imagenBase64 || null;
    }

    if (formData.s_telefono) {
      formData.s_telefono = formData.s_telefono.toString().replace(/\D/g, '');
    }

    const serviceCall = this.action === 'edit'
      ? this.ProveedoresService.actualizarProveedor(this.proveedorData.id_proveedor, formData)
      : this.ProveedoresService.crearProveedor(formData);

    serviceCall.subscribe({
      next: (response: any) => {
        Swal.fire('Éxito', `Proveedor ${this.action === 'edit' ? 'actualizado' : 'creado'} correctamente`, 'success');
        this.dialogRef.close(response);
      },
      error: (error: any) => {
        let errorMessage =
          error.error?.message ||
          error.message ||
          `Ocurrió un error al ${this.action === 'edit' ? 'actualizar' : 'crear'} el proveedor`;
        Swal.fire('Error', errorMessage, 'error');
      }
    });
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
        this.proveedoresForm.patchValue({ s_img_proveedor: this.imagenBase64 });
      };
    }
  }

  soloNumeros(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }


}
