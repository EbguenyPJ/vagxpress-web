import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule
  ],
  templateUrl: './dialog-detalle-refaccion.component.html',
  styleUrl: './dialog-detalle-refaccion.component.scss'
})
export class DialogDetalleRefaccionComponent implements OnInit {
  refaccionData: any;
  ruta_img_parts = conexion.url_img;

  constructor(
    public dialogRef: MatDialogRef<DialogDetalleRefaccionComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private refaccionesService: RefaccionesService
  ) {}

  ngOnInit(): void {
    this.loadRefaccionData();
  }

  loadRefaccionData() {
    const idRefaccion = this.dataDialog.id_refaccion;
    this.refaccionesService.getRefaccionById('', idRefaccion).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data.length > 0) {
          this.refaccionData = response.data[0];
        } else {
          Swal.fire('Error', 'No se encontraron datos para la refacción.', 'error');
        }
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la información de la refacción.', 'error');
      }
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
