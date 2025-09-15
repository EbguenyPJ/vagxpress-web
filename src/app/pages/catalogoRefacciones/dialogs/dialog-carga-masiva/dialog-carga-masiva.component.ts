import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
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
import { RefaccionesService } from 'app/services/refacciones/refacciones.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-carga-masiva',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dialog-carga-masiva.component.html',
  styleUrl: './dialog-carga-masiva.component.scss',
})
export class DialogCargaMasivaComponent implements OnInit {
  itemForm: FormGroup;

  marcas: any[] = [];
  categorias: any[] = [];
  subcategorias: any[] = [];
  subcategoriasFiltradas: any[] = [];

  refaccionesParaCargar: any[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'nombre',
    'noParte',
    'marca',
    'categoria',
    'subcategoria',
    'actions',
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCargaMasivaComponent>,
    private refaccionesService: RefaccionesService
  ) {
    this.itemForm = this.fb.group({
      s_nombre_refaccion: ['', Validators.required],
      s_numero_parte: ['', Validators.required],
      id_marca_refaccion: [null, Validators.required],
      id_categoria_refaccion: [null, Validators.required],
      id_subcategoria_refaccion: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.escucharCambiosDeCategoria();
  }

  cargarCatalogos() {
    forkJoin({
      marcas: this.refaccionesService
        .getMarcas('')
        .pipe(catchError(() => of({ data: [] }))),
      categorias: this.refaccionesService
        .getCategorias('')
        .pipe(catchError(() => of({ data: [] }))),
      subcategorias: this.refaccionesService
        .getSubcategorias('')
        .pipe(catchError(() => of({ data: [] }))),
    }).subscribe((res: any) => {
      this.marcas = res.marcas.data;
      this.categorias = res.categorias.data;
      this.subcategorias = res.subcategorias.data;
    });
  }

  escucharCambiosDeCategoria() {
    this.itemForm
      .get('id_categoria_refaccion')
      ?.valueChanges.subscribe((idCategoria) => {
        this.subcategoriasFiltradas = this.subcategorias.filter(
          (sub) => sub.id_categoria_refaccion === idCategoria
        );
        this.itemForm.get('id_subcategoria_refaccion')?.reset();
      });
  }

  agregarItem() {
    if (this.itemForm.invalid) {
      Swal.fire('Atención', 'Por favor, completa todos los campos.', 'warning');
      return;
    }

    const nuevoItem = this.itemForm.value;

    if (
      this.refaccionesParaCargar.some(
        (item) => item.s_numero_parte === nuevoItem.s_numero_parte
      )
    ) {
      Swal.fire('Error', 'El Número de Parte ya existe en la lista.', 'error');
      return;
    }

    const esDuplicado = this.refaccionesParaCargar.some(
      (item) =>
        item.s_nombre_refaccion === nuevoItem.s_nombre_refaccion &&
        item.id_clase_refaccion === nuevoItem.id_clase_refaccion &&
        item.id_categoria_refaccion === nuevoItem.id_categoria_refaccion &&
        item.id_subcategoria_refaccion === nuevoItem.id_subcategoria_refaccion
    );

    if (esDuplicado) {
      Swal.fire(
        'Error',
        'Ya existe una refacción con la misma combinación de Nombre, Clase, Categoría y Subcategoría.',
        'error'
      );
      return;
    }

    this.refaccionesParaCargar.unshift(nuevoItem);
    this.dataSource.data = [...this.refaccionesParaCargar];
    this.itemForm.reset();
  }

  eliminarItem(index: number) {
    this.refaccionesParaCargar.splice(index, 1);
    this.dataSource.data = [...this.refaccionesParaCargar];
  }

  editarItem(index: number) {
    const itemAEditar = this.refaccionesParaCargar[index];
    this.itemForm.patchValue(itemAEditar);
    this.eliminarItem(index);
  }

  getMarcaNombre(id: number): string {
    return (
      this.marcas.find((c) => c.id_marca_refaccion === id)?.s_marca_refaccion ||
      ''
    );
  }
  getCategoriaNombre(id: number): string {
    return (
      this.categorias.find((c) => c.id_categoria_refaccion === id)
        ?.s_categoria_refaccion || ''
    );
  }
  getSubcategoriaNombre(id: number): string {
    return (
      this.subcategorias.find((s) => s.id_subcategoria_refaccion === id)
        ?.s_subcategoria_refaccion || ''
    );
  }

  guardarTodo() {
    if (this.refaccionesParaCargar.length === 0) {
      Swal.fire(
        'Atención',
        'No hay refacciones en la lista para guardar.',
        'warning'
      );
      return;
    }

    Swal.fire({
      title: 'Guardando Refacciones...',
      text: 'Por favor espere.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const payload = {
      refacciones: this.refaccionesParaCargar,
    };

    console.log('Payload: ', payload);

    this.refaccionesService.crearRefaccionesMasivo('', payload).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Las refacciones han sido guardadas.', 'success');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron guardar las refacciones.', 'error');
      },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
