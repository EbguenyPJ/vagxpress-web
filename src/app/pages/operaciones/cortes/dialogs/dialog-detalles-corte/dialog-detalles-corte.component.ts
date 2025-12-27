import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatDivider } from "@angular/material/divider";
import { OnInit } from '@angular/core';
import { CortesService } from 'app/services/cortes/cortes.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { conexion } from 'app/conexion';
import { MatIcon } from "@angular/material/icon";


@Component({
  selector: 'app-dialog-detalles-corte',
  standalone: true,
  imports: [ CommonModule, MatProgressSpinner, MatIcon],
  templateUrl: './dialog-detalles-corte.component.html',
  styleUrl: './dialog-detalles-corte.component.scss'
})
export class DialogDetallesCorteComponent implements OnInit{

  corte: any = null;
  isLoading = true;
  evidencias: any[] = [];
  urlEvidencias: string = conexion.url_img + '/evidenciasCortes/';


  constructor(
    public dialogRef: MatDialogRef<DialogDetallesCorteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_corte: number },
    private cortesService: CortesService
  ) {}

  ngOnInit(): void {
    this.cargarDetalle();
  }


  cargarDetalle() {
    this.isLoading = true;
    this.cortesService.getCorteById('', this.data.id_corte).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servicio:', res);
        // ⚠ Asegúrate de usar exactamente lo que devuelve tu backend
        this.corte = res.corte;
        this.evidencias = res.evidencias;
        this.isLoading = false;
        console.log('Corte cargado:', this.corte);
        console.log('Evidencias cargadas:', this.evidencias);
      },
      error: (err) => {
        console.error('Error al cargar corte:', err);
        this.isLoading = false;
      }
    });
  }


    // Devuelve URL completa de la evidencia
  getEvidenciaUrl(nombreArchivo: string): string {
    return this.urlEvidencias + nombreArchivo;
  }

  cerrar() {
    this.dialogRef.close();
  }

}
