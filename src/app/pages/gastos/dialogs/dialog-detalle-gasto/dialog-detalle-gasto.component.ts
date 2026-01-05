import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common'; // Para que funcione ngFor en Angular 19
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-detalle-gasto',
  imports: [MatIcon, CommonModule, MatDialogModule],
  templateUrl: './dialog-detalle-gasto.component.html',
  styleUrl: './dialog-detalle-gasto.component.scss'
})
export class DialogDetalleGastoComponent implements OnInit {
  window: any;
  gasto: any;
  mostrarOverlay: boolean = false;
  imagenGrande: string = '';

  cerrar() {
    this.dialogRef.close();
  }

  constructor(
    public dialogRef: MatDialogRef<DialogDetalleGastoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("DATA RECIBIDA EN MODAL:", data);
    this.gasto = data.gasto;
  }


  
  ngOnInit(): void {
    this.gasto = this.data.gasto || this.data;

    // Mapear tipo_evidencia según el archivo
    if (!this.gasto.tipo_evidencia) {
      if (this.gasto.url_evidencia) {
        const ext = this.gasto.url_evidencia.split('.').pop()?.toLowerCase();
        if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') {
          this.gasto.tipo_evidencia = 1; // Imagen
        } else if (ext === 'mp4') {
          this.gasto.tipo_evidencia = 2; // Video
        } else if (ext === 'mp3' || ext === 'wav') {
          this.gasto.tipo_evidencia = 3; // Audio
        } else {
          this.gasto.tipo_evidencia = 4; // Documento
        }
      }
    }
  }



  descargarDocumento() {
    if (this.data?.url_evidencia) {
      window.open(this.data.url_evidencia, "_blank");
    } else {
      console.error("No existe la URL de evidencia.");
    }
  }


  cerrarOverlay() {
    this.mostrarOverlay = false;
    this.imagenGrande = '';
  }

  verImagen(url: string) {
    this.imagenGrande = url;
    this.mostrarOverlay = true;
  }




}
