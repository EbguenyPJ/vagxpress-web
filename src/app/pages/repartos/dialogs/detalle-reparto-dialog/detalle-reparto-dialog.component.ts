import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialog, } from '@angular/material/dialog';
import { Component, ElementRef, Inject, OnInit, signal, ViewChild } from '@angular/core';
import { Validators, UntypedFormGroup, ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectionListChange } from '@angular/material/list';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { environment } from 'environments/environment';
import { refaccionInsertadaModel } from 'app/models/refaccionInsertadaModel';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from '@angular/material/tooltip';

import Swal from "sweetalert2";


import * as L from 'leaflet';



import { RepartosService } from 'app/services/repartos/repartos.service';
import { EvidenciasRepartoDialogComponent } from '../evidencias-reparto-dialog/evidencias-reparto-dialog.component';



export interface DialogData {
  id_orden: number;
}


@Component({
  selector: 'app-detalle-reparto-dialog',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
    MatNativeDateModule,
    MatMomentDateModule,
    MatCardModule,
    MatAutocompleteModule,
    MatExpansionModule,
    DragDropModule,
    CommonModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './detalle-reparto-dialog.component.html',
  styleUrl: './detalle-reparto-dialog.component.scss'
})
export class DetalleRepartoDialogComponent {
dialogTitle: any;
id_orden: any;
reparto: any;
orden: any;




// Variables para mapa
@ViewChild('mapRuta', { static: false }) mapRutaRef!: ElementRef<HTMLDivElement>;
private mapRuta?: L.Map;
routeStats?: { km: number; n: number; durMin: number; avgKmh: number };
private capasRutas = L.featureGroup();





  constructor(
      public dialogRef: MatDialogRef<DetalleRepartoDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private RepartosService: RepartosService,
      private dialog: MatDialog,
    ){
      this.dialogTitle = 'Detalle de reparto';
      this.id_orden =  data.id_orden;
    }

  
  ngOnInit() {
    if(this.id_orden){
      this.getDetalleReparto();

      this.dialogRef.afterOpened().subscribe(() => {
        setTimeout(() => this.mapRuta?.invalidateSize(), 0);
      });
    }
  }


  ngOnDestroy(): void {
    // Limpia el mapa al cerrar el diálogo
    if (this.mapRuta) {
      this.mapRuta.remove();
      this.mapRuta = undefined;
    }
  }


  async getDetalleReparto(){
    Swal.fire({
      title: '¡Espere un momento!',
      html: 'Cargando datos...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.RepartosService.getDetalleReparto(this.id_orden).subscribe({
      next: (response: any) => {
        this.reparto = response;
        this.reparto = this.reparto.data;
        // El API nuevo devuelve `orden` como objeto único (antes era un array de un elemento).
        this.orden = this.reparto.orden;
        console.log("Reparto: ", this.reparto);


        //Renderiza el mapa cuando el template ya tenga el contenedor
        if (this.reparto?.ruta_salida?.length) {
          console.log("se renderiza el mapa")
          setTimeout(() => this.renderMapaRuta(), 0);
        }

        Swal.close();
      },
      error: (error: any) => {
        Swal.close();
        Swal.fire('Error', 'Hubo un error', 'error');
        console.log(error);
      }
    }); 
  }
  
  

  // renderizamos salida y regreso
  private renderMapaRuta(): void {
    if (!this.mapRutaRef) return;

    const salida = this.normalizePuntos(this.reparto?.ruta_salida);
    const regreso = this.normalizePuntos(this.reparto?.ruta_regreso);

    if (!salida.length && !regreso.length) return;

    // Crear mapa una sola vez
    if (!this.mapRuta) {
      this.mapRuta = L.map(this.mapRutaRef.nativeElement, { zoomControl: true });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(this.mapRuta);

      this.capasRutas.addTo(this.mapRuta);
    }

    // Limpia rutas anteriores
    this.capasRutas.clearLayers();

    /* ======================
      RUTA DE SALIDA
    ====================== */
    if (salida.length) {
      const latlngsSalida = salida.map(p => [p.lat, p.lng]) as [number, number][];

      const polySalida = L.polyline(latlngsSalida, {
        color: '#16a34a',
        weight: 5,
        opacity: 0.9
      });

      polySalida.addTo(this.capasRutas);

      // Inicio salida
      L.circleMarker(latlngsSalida[0], {
        radius: 6,
        color: '#16a34a',
        fillColor: '#16a34a',
        fillOpacity: 1
      })
        .bindTooltip('Inicio salida', { direction: 'top' })
        .addTo(this.capasRutas);

      // Fin salida
      L.circleMarker(latlngsSalida[latlngsSalida.length - 1], {
        radius: 6,
        color: '#15803d',
        fillColor: '#15803d',
        fillOpacity: 1
      })
        .bindTooltip('Fin salida', { direction: 'top' })
        .addTo(this.capasRutas);
    }

    /* ======================
      RUTA DE REGRESO
    ====================== */
    if (regreso.length) {
      const latlngsRegreso = regreso.map(p => [p.lat, p.lng]) as [number, number][];

      const polyRegreso = L.polyline(latlngsRegreso, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.9,
        dashArray: '6,4'
      });

      polyRegreso.addTo(this.capasRutas);

      // Inicio regreso
      L.circleMarker(latlngsRegreso[0], {
        radius: 6,
        color: '#2563eb',
        fillColor: '#2563eb',
        fillOpacity: 1
      })
        .bindTooltip('Inicio regreso', { direction: 'top' })
        .addTo(this.capasRutas);

      // Fin regreso
      L.circleMarker(latlngsRegreso[latlngsRegreso.length - 1], {
        radius: 6,
        color: '#1e40af',
        fillColor: '#1e40af',
        fillOpacity: 1
      })
        .bindTooltip('Fin regreso', { direction: 'top' })
        .addTo(this.capasRutas);
    }

    // Ajusta el mapa para mostrar ambas rutas
    this.mapRuta.fitBounds(this.capasRutas.getBounds(), {
      padding: [30, 30]
    });

    // Fix si estaba oculto
    setTimeout(() => this.mapRuta!.invalidateSize(), 0);
  }


  private normalizePuntos(raw: any[]): { lat: number; lng: number; ts?: string }[] {
    const pts = (raw || []).map((p: any) => ({
      lat: Number(p.n_latitud),
      lng: Number(p.n_longitud),
      ts:  p.timestamp
    }));
    return pts.filter((pt, i, arr) =>
      i === 0 || pt.lat !== arr[i - 1].lat || pt.lng !== arr[i - 1].lng
    );
  }




  abrirEvidenciasReparto(evidencias: any, tipo: any){
    if(tipo === 3){
      evidencias = [{s_evidencia_orden: evidencias}];
    }
    const dialogRef = this.dialog.open(EvidenciasRepartoDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { evidencias: evidencias, tipo: tipo },
      autoFocus: false,
    });
  }







  
}
