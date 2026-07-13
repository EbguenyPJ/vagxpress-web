import { formatDate } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GastosService } from 'app/services/gastos/gastos.service';
import Swal from 'sweetalert2';
import { MatIcon } from "@angular/material/icon";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-dialog-crear-gasto',
  imports: [MatIcon, ReactiveFormsModule, CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './dialog-crear-gasto.component.html',
  styleUrl: './dialog-crear-gasto.component.scss'
})
export class DialogCrearGastoComponent {

  gastosForm!: UntypedFormGroup;
  tiposGasto: any[] = [];
  archivoSeleccionado: File | null = null;
  hoy: string = '';


  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>;

  sucursalNombre: string = '';


  constructor(private gastosService: GastosService,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { sucursal: any },
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogCrearGastoComponent>
  ) { }


  ngOnInit(): void {
    this.loadTiposGasto();
    this.gastosForm = this.createGastoForm();

    // Leer sucursal desde localStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.sucursalNombre = user?.s_sucursal ?? '';
    }

    // Fecha de hoy para input date
    this.hoy = new Date().toISOString().split('T')[0];

  }


  /** Obtener id de sucursal desde localStorage */
  getSucursalId(): number | null {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.id_sucursal ?? null;
  }

  /** Obtener id de usuario desde localStorage */
  getUsuarioId(): number | null {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.id_usuario ?? null;
  }



  createGastoForm(): UntypedFormGroup {
    return this.fb.group({
      id_tipo_gasto: [null, Validators.required],
      id_sucursal: [this.getSucursalId(), Validators.required],
      n_cantidad: [1, [Validators.required, Validators.min(1)]],
      n_costo: [0, [Validators.required, Validators.min(0)]],
      s_concepto: ['', Validators.required],
      d_fecha_gasto: [formatDate(new Date(), 'yyyy-MM-dd', 'en-US'), Validators.required],
      id_usuario_crea: [this.getUsuarioId()],
      s_evidencia: [null],        // <-- cambiar aquí
      id_tipo_evidencia: [null]   // <-- cambiar aquí
    });
  }




  loadTiposGasto() {
    const token = localStorage.getItem('token') || '';
    this.gastosService.getTiposGastos().subscribe({
      next: (resp: any) => {
        console.log('Respuesta backend tiposGasto:', resp);
        if (resp.status) {
          this.tiposGasto = resp.data;
        }
      },
      error: (err: any) => console.error('Error al cargar tipos de gasto', err)
    });
  }



  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }




  /** Enviar formulario */
  submit() {
    if (!this.gastosForm.valid) {
      this.gastosForm.markAllAsTouched();
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'No se encontró token de usuario', 'error');
      return;
    }

    const valores = this.gastosForm.getRawValue();

    const enviar = (payload: any) => {
      this.gastosService.crearGasto(payload).subscribe({
        next: () => {
          Swal.close();
          Swal.fire('Éxito', 'Gasto registrado correctamente', 'success');
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          Swal.close();
          console.error('Error al registrar gasto', err);
          Swal.fire('Error', err?.error?.message ?? 'No se pudo registrar el gasto', 'error');
        },
      });
    };

    // El API recibe la evidencia como base64 dentro del payload JSON.
    if (this.archivoSeleccionado) {
      const lector = new FileReader();
      lector.onload = () => enviar({
        ...valores,
        archivo: { evidencia: String(lector.result) },
        extension: this.archivoSeleccionado!.name.split('.').pop()?.toLowerCase(),
      });
      lector.readAsDataURL(this.archivoSeleccionado);
    } else {
      enviar(valores);
    }

    Swal.fire({
      title: 'Registrando gasto...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  }






}
