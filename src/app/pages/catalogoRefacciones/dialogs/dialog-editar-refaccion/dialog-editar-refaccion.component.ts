import { Component, Inject, OnInit } from '@angular/core';
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
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { RefaccionesService } from 'app/services/refacciones/refacciones.service';
import Swal from 'sweetalert2';
import { DialogSeleccionarEquivalenciasComponent } from '../dialog-seleccionar-equivalencias/dialog-seleccionar-equivalencias.component';

@Component({
  selector: 'app-dialog-editar-refaccion',
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
    MatCheckboxModule,
    MatChipsModule,
  ],
  templateUrl: './dialog-editar-refaccion.component.html',
  styleUrl: './dialog-editar-refaccion.component.scss',
})
export class DialogEditarRefaccionComponent implements OnInit {
  refaccionForm: FormGroup;

  marcas: any[] = [];
  categorias: any[] = [];
  subcategorias: any[] = [];
  subcategoriasFiltradas: any[] = [];
  clases: any[] = [];
  unidadesMedida: any[] = [];
  posiciones: any[] = [];
  ubicaciones: any[] = [];
  proveedores: any[] = [];
  equivalenciasSeleccionadas: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogEditarRefaccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private refaccionesService: RefaccionesService,
    private dialog: MatDialog
  ) {
    this.refaccionForm = this.fb.group({
      s_nombre_refaccion: ['', Validators.required],
      s_numero_parte: ['', Validators.required],
      s_descripcion: [''],
      s_codigo_interno: [''],
      n_precio_compra: [0],
      n_precio_venta: [0],
      n_precio_mayoreo: [0],
      n_stock_actual: [0],
      n_stock_minimo: [0],
      n_tiempo_reposicion: [0],
      id_marca_refaccion: [null],
      id_categoria_refaccion: [null],
      id_subcategoria_refaccion: [null],
      id_clase_refaccion: [null],
      id_unidad_medida: [null],
      id_posicion_vehiculo: [null],
      id_ubicacion_almacen: [null],
      id_proveedor: [null],
      b_importado: [false],
      refacciones_equivalentes: [[]],
    });
  }

  ngOnInit(): void {
    this.cargarTodosLosDatos();
    this.escucharCambiosDeCategoria();
  }

  cargarTodosLosDatos() {
    Swal.fire({
      title: 'Cargando Datos...',
      text: 'Por favor espere.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const observables = {
      refaccion: this.refaccionesService
        .getRefaccionById(this.data.refaccion.id_refaccion)
        .pipe(catchError(() => of({ data: [] }))),
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
      unidadesMedida: this.refaccionesService
        .getUnidadesMedida()
        .pipe(catchError(() => of({ data: [] }))),
      posiciones: this.refaccionesService
        .getPosicionesVehiculo()
        .pipe(catchError(() => of({ data: [] }))),
      ubicaciones: this.refaccionesService
        .getUbicacionesAlmacen()
        .pipe(catchError(() => of({ data: [] }))),
      proveedores: this.refaccionesService
        .getProveedores()
        .pipe(catchError(() => of({ data: [] }))),
    };

    forkJoin(observables).subscribe({
      next: (responses: any) => {
        this.marcas = responses.marcas.data;
        this.categorias = responses.categorias.data;
        this.subcategorias = responses.subcategorias.data;
        this.clases = responses.clases.data;
        this.unidadesMedida = responses.unidadesMedida.data;
        this.posiciones = responses.posiciones.data;
        this.ubicaciones = responses.ubicaciones.data;
        this.proveedores = responses.proveedores.data;

        // El API nuevo devuelve la refacción como objeto único (antes venía en data[0]).
        const refaccionData = responses.refaccion.data;
        if (!refaccionData) {
          Swal.fire(
            'Error',
            'No se pudo cargar la información detallada de la refacción.',
            'error'
          );
          this.dialogRef.close();
          return;
        }

        if (refaccionData.refacciones_equivalentes) {
          this.equivalenciasSeleccionadas =
            refaccionData.refacciones_equivalentes;
          const idsEquivalentes = refaccionData.refacciones_equivalentes.map(
            (r: any) => r.id_refaccion
          );
          this.refaccionForm
            .get('refacciones_equivalentes')
            ?.setValue(idsEquivalentes);
        }

        const refaccionParaFormulario = {
          ...refaccionData,
          b_importado: refaccionData.b_importado == 1,
        };
        this.refaccionForm.patchValue(refaccionParaFormulario, {
          emitEvent: false,
        });

        if (refaccionParaFormulario.id_categoria_refaccion) {
          this.filtrarSubcategorias(
            refaccionParaFormulario.id_categoria_refaccion
          );
        }
        Swal.close();
      },
      error: (err: any) => {
        Swal.close();
        Swal.fire(
          'Error Inesperado',
          'Ocurrió un error al cargar los datos iniciales.',
          'error'
        );
        console.error(err);
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

  escucharCambiosDeCategoria() {
    this.refaccionForm
      .get('id_categoria_refaccion')
      ?.valueChanges.subscribe((idCategoria) => {
        this.filtrarSubcategorias(idCategoria);
        this.refaccionForm.get('id_subcategoria_refaccion')?.reset();
      });
  }

  filtrarSubcategorias(idCategoria: number) {
    this.subcategoriasFiltradas = this.subcategorias.filter(
      (sub) => sub.id_categoria_refaccion === idCategoria
    );
  }

  submit() {
    if (this.refaccionForm.valid) {
      Swal.fire({
        title: 'Guardando Cambios...',
        text: 'Por favor espere.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const datosParaBackend = {
        ...this.refaccionForm.value,
        b_importado: this.refaccionForm.value.b_importado ? 1 : 0,
      };

      this.refaccionesService
        .editarRefaccion(this.data.refaccion.id_refaccion, datosParaBackend)
        .subscribe({
          next: () => {
            Swal.fire(
              '¡Éxito!',
              'La refacción ha sido actualizada.',
              'success'
            );
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo actualizar la refacción.', 'error');
          },
        });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
