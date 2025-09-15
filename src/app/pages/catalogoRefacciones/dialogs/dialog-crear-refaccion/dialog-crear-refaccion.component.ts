import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { RefaccionesService } from 'app/services/refacciones/refacciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-crear-refaccion',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogTitle, MatDialogContent,
    MatDialogActions, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule
  ],
  templateUrl: './dialog-crear-refaccion.component.html',
  styleUrl: './dialog-crear-refaccion.component.scss'
})
export class DialogCrearRefaccionComponent implements OnInit {
  refaccionForm: FormGroup;

  marcas: any[] = [];
  categorias: any[] = [];
  subcategorias: any[] = [];
  subcategoriasFiltradas: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCrearRefaccionComponent>,
    private refaccionesService: RefaccionesService
  ) {
    this.refaccionForm = this.fb.group({
      s_nombre_refaccion: ['', Validators.required],
      s_numero_parte: ['', Validators.required],
      id_marca_refaccion: [null, Validators.required],
      id_categoria_refaccion: [null, Validators.required],
      id_subcategoria_refaccion: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.escucharCambiosDeCategoria();
  }

    cargarCatalogos() {
    this.refaccionesService.getMarcas('').subscribe((res: any) => this.marcas = res.data);

    this.refaccionesService.getCategorias('').subscribe((res: any) => this.categorias = res.data);

    this.refaccionesService.getSubcategorias('').subscribe((res: any) => this.subcategorias = res.data);
  }

    escucharCambiosDeCategoria() {
    this.refaccionForm.get('id_categoria_refaccion')?.valueChanges.subscribe(idCategoriaSeleccionada => {
      this.subcategoriasFiltradas = this.subcategorias.filter(
        sub => sub.id_categoria_refaccion === idCategoriaSeleccionada
      );
      this.refaccionForm.get('id_subcategoria_refaccion')?.reset();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    if (this.refaccionForm.valid) {
      this.refaccionesService.crearRefaccion('', this.refaccionForm.value).subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', 'La refacción ha sido creada correctamente.', 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo crear la refacción.', 'error');
          console.error(err);
        }
      });
    } else {
      this.refaccionForm.markAllAsTouched();
    }
  }
}
