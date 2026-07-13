import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  MatDialog,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { RefaccionesService } from 'app/services/refacciones/refacciones.service';
import Swal from 'sweetalert2';

import { MatChipsModule } from '@angular/material/chips';
import { DialogSeleccionarEquivalenciasComponent } from '../dialog-seleccionar-equivalencias/dialog-seleccionar-equivalencias.component';
import { DialogConstructorReglaComponent } from '../dialog-constructor-regla/dialog-constructor-regla.component';

@Component({
  selector: 'app-dialog-crear-refaccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatChipsModule,
  ],
  templateUrl: './dialog-crear-refaccion.component.html',
  styleUrl: './dialog-crear-refaccion.component.scss',
})
export class DialogCrearRefaccionComponent implements OnInit {
  refaccionForm: FormGroup;

  marcas: any[] = [];
  categorias: any[] = [];
  subcategorias: any[] = [];
  subcategoriasFiltradas: any[] = [];
  clases: any[] = [];
  equivalenciasSeleccionadas: any[] = [];
  reglasCompatibilidad: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCrearRefaccionComponent>,
    private refaccionesService: RefaccionesService,
    private dialog: MatDialog
  ) {
    this.refaccionForm = this.fb.group({
      s_nombre_refaccion: ['', Validators.required],
      s_numero_parte: ['', Validators.required],
      id_marca_refaccion: [null, Validators.required],
      id_categoria_refaccion: [null, Validators.required],
      id_subcategoria_refaccion: [null, Validators.required],
      n_precio_compra: [null, Validators.required],
      id_clase_refaccion: [1, Validators.required],
      refacciones_equivalentes: [[]],
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.escucharCambiosDeCategoria();
  }

  cargarCatalogos() {
    Swal.fire({
      title: 'Cargando Datos...',
      text: 'Por favor, espere un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    forkJoin({
      marcas: this.refaccionesService
        .getMarcas()
        .pipe(catchError(() => of({ data: [] }))),
      categorias: this.refaccionesService
        .getCategorias()
        .pipe(catchError(() => of({ data: [] }))),
      subcategorias: this.refaccionesService
        .getSubcategorias()
        .pipe(catchError(() => of({ data: [] }))),
      clases: this.refaccionesService
        .getClases()
        .pipe(catchError(() => of({ data: [] }))),
    }).subscribe({
      next: (respuestas: any) => {
        this.marcas = respuestas.marcas.data;
        this.categorias = respuestas.categorias.data;
        this.subcategorias = respuestas.subcategorias.data;
        this.clases = respuestas.clases.data;

        Swal.close();
      },
      error: (err: any) => {
        console.error('Error al cargar catálogos:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error Inesperado',
          text: 'No se pudieron cargar los datos necesarios. Por favor, intente de nuevo.',
        });
        this.dialogRef.close();
      },
    });
  }

  abrirDialogoEquivalencias(): void {
    const subcategoriaId = this.refaccionForm.get(
      'id_subcategoria_refaccion'
    )?.value;

    const dialogRef = this.dialog.open(
      DialogSeleccionarEquivalenciasComponent,
      {
        width: '600px',
        data: { id_subcategoria_refaccion: subcategoriaId },
      }
    );

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.equivalenciasSeleccionadas = resultado;
        const idsEquivalentes = resultado.map((ref: any) => ref.id_refaccion);
        this.refaccionForm
          .get('refacciones_equivalentes')
          ?.setValue(idsEquivalentes);
      }
    });
  }

  removerEquivalencia(refaccion: any): void {
    const index = this.equivalenciasSeleccionadas.indexOf(refaccion);
    if (index >= 0) {
      this.equivalenciasSeleccionadas.splice(index, 1);
      const idsEquivalentes = this.equivalenciasSeleccionadas.map(
        (r) => r.id_refaccion
      );
      this.refaccionForm
        .get('refacciones_equivalentes')
        ?.setValue(idsEquivalentes);
    }
  }

  abrirConstructorRegla(): void {
    const dialogRef = this.dialog.open(DialogConstructorReglaComponent, {
      width: '640px',
    });

    dialogRef.afterClosed().subscribe((regla) => {
      if (regla) {
        this.reglasCompatibilidad.push(regla);
      }
    });
  }

  removerRegla(index: number): void {
    this.reglasCompatibilidad.splice(index, 1);
  }

  escucharCambiosDeCategoria() {
    this.refaccionForm
      .get('id_categoria_refaccion')
      ?.valueChanges.subscribe((idCategoriaSeleccionada) => {
        this.subcategoriasFiltradas = this.subcategorias.filter(
          (sub) => sub.id_categoria_refaccion === idCategoriaSeleccionada
        );
        this.refaccionForm.get('id_subcategoria_refaccion')?.reset();
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    if (this.refaccionForm.valid) {
      const payload = {
        ...this.refaccionForm.value,
        reglas_compatibilidad: this.reglasCompatibilidad.map((r) => ({
          id_marcas: r.id_marcas,
          id_modelos: r.id_modelos,
          id_generaciones: r.id_generaciones,
          id_motores: r.id_motores,
          s_resumen: r.s_resumen,
        })),
      };

      this.refaccionesService
        .crearRefaccion(payload)
        .subscribe({
          next: (response: any) => {
            Swal.fire(
              '¡Éxito!',
              'La refacción ha sido creada correctamente.',
              'success'
            );
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            Swal.fire('Error', 'No se pudo crear la refacción.', 'error');
            console.error(err);
          },
        });
    } else {
      this.refaccionForm.markAllAsTouched();
    }
  }
}
