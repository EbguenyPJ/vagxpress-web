import {
  Component,
  Inject,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { RefaccionesService } from 'app/services/refacciones/refacciones.service';
import { conexion } from 'app/conexion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-detalle-refaccion',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './dialog-detalle-refaccion.component.html',
  styleUrl: './dialog-detalle-refaccion.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DialogDetalleRefaccionComponent implements OnInit {
  refaccionData: any;
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<DialogDetalleRefaccionComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private refaccionesService: RefaccionesService
  ) {}

  ngOnInit(): void {
    this.loadRefaccionData();
  }

  loadRefaccionData() {
    this.isLoading = true;
    const idRefaccion = this.dataDialog.id_refaccion;
    this.refaccionesService.getRefaccionById('', idRefaccion).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data.length > 0) {
          this.refaccionData = response.data[0];
        } else {
          Swal.fire(
            'Error',
            'No se encontraron datos para la refacción.',
            'error'
          );
        }
        this.isLoading = false;
      },
      error: (err) => {
        Swal.fire(
          'Error',
          'No se pudo cargar la información de la refacción.',
          'error'
        );
        this.isLoading = false;
      },
    });
  }

  getRefaccionImage(imageUrl: string): string {
    if (imageUrl && imageUrl.trim() !== '') {
      return imageUrl;
    }
    return 'assets/images/image-placeholder.jpg';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
