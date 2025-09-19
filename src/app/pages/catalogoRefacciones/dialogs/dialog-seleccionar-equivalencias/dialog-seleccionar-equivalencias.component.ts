import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RefaccionesService } from 'app/services/refacciones/refacciones.service';

@Component({
  selector: 'app-dialog-seleccionar-equivalencias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dialog-seleccionar-equivalencias.component.html',
})
export class DialogSeleccionarEquivalenciasComponent implements OnInit {
  todasLasRefacciones: any[] = [];
  selectionControl = new FormControl<number[]>([]);
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<DialogSeleccionarEquivalenciasComponent>,
    private refaccionesService: RefaccionesService
  ) {}

  ngOnInit(): void {
    this.refaccionesService.getRefacciones('').subscribe({
      next: (res: any) => {
        this.todasLasRefacciones = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar refacciones para equivalencia', err);
        this.isLoading = false;
      },
    });
  }

  onConfirm(): void {
    const seleccionados = this.todasLasRefacciones.filter((ref) =>
      this.selectionControl.value?.includes(ref.id_refaccion)
    );
    this.dialogRef.close(seleccionados);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
