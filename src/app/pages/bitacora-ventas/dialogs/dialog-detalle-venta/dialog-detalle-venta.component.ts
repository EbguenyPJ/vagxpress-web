import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner, MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIcon } from "@angular/material/icon";
import { BitacoraVentasComponent } from '../../bitacora-ventas.component';
import { BitacoraVentasService } from 'app/services/bitacora-ventas/bitacora-ventas.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-dialog-detalle-venta',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule, MatIcon],
  templateUrl: './dialog-detalle-venta.component.html',
  styleUrls: ['./dialog-detalle-venta.component.scss']
})
export class DialogDetalleVentaComponent implements OnInit {

  venta: any;
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<DialogDetalleVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private BitacoraVentasService: BitacoraVentasService,
  ) { this.venta = data.venta;}

  ngOnInit(): void {
    this.cargarDetalle();
  }


cargarDetalle() {
  this.isLoading = true;
  const s_token = localStorage.getItem('s_token') || '';

  this.BitacoraVentasService
    .getVentaById(this.data.id_venta)
    .subscribe({
      next: (res: any) => {
        console.log('Respuesta del servicio:', res);

        // ✔️ Soporta ambos formatos de backend
        this.venta = res?.data ?? res;

        this.isLoading = false;
        console.log('Venta cargada en dialog:', this.venta);
      },
      error: (err: any) => {
        console.error('Error al cargar venta:', err);
        this.isLoading = false;
      }
    });
}




  cerrar() {
    this.dialogRef.close();
  }




}
