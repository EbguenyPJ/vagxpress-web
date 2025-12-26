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
import { conexion } from 'app/conexion';
import { refaccionInsertadaModel } from 'app/models/refaccionInsertadaModel';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from "@angular/material/divider";
import Swal from "sweetalert2";


import * as L from 'leaflet';



import { RepartosService } from 'app/services/repartos/repartos.service';



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
    MatDividerModule
  ],
  templateUrl: './detalle-reparto-dialog.component.html',
  styleUrl: './detalle-reparto-dialog.component.scss'
})
export class DetalleRepartoDialogComponent {
dialogTitle: any;
id_orden: any;
reparto: any;
orden: any;

url_firma: any = conexion.url_img + "/evidenciasVXM/imgFirmas/";
url_evidencia_salida_reparto: any = conexion.url_img + "/evidenciasVXM/imgEvidenciasSalidaReparto/";
url_evidencia_fin_reparto: any = conexion.url_img + "/evidenciasVXM/imgEvidenciasFinReparto/";




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

    this.RepartosService.getDetalleReparto("", this.id_orden).subscribe({
      next: (response) => {
        this.reparto = response;
        this.reparto = this.reparto.data;
        this.orden = this.reparto.orden[0];
        console.log("Reparto: ", this.reparto);


        //Renderiza el mapa cuando el template ya tenga el contenedor
        if (this.reparto?.ruta_salida?.length) {
          console.log("se renderiza el mapa")
          setTimeout(() => this.renderMapaRuta(), 0);
        }

        Swal.close();
      },
      error: (error) => {
        Swal.close();
        Swal.fire('Error', 'Hubo un error', 'error');
        console.log(error);
      }
    }); 
  }
  
  




  //Mapa de prueba de ruta
  // private renderMapaRuta(): void
  // {
  //     if (!this.mapRutaRef) return;

  //     const puntos = this.normalizePuntos(this.reparto?.ruta_salida);
  //     const puntos2 = this.normalizePuntos(this.reparto?.ruta_regreso);
  //     this.routeStats = this.calcRutaStats(puntos);

  //     if (!puntos.length) return;

  //     // Crea/rehúsa el mapa
  //     if (!this.mapRuta) {
  //       this.mapRuta = L.map(this.mapRutaRef.nativeElement, { zoomControl: true });
  //       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //         maxZoom: 19,
  //         attribution: '© OpenStreetMap'
  //       }).addTo(this.mapRuta);
  //     }

  //     const latlngs = puntos.map(p => [p.lat, p.lng]) as [number, number][];

  //     const poly = L.polyline(latlngs, { weight: 5, opacity: 0.9 }).addTo(this.mapRuta);

  //     // Inicio / Fin
  //     L.circleMarker(latlngs[0], { radius: 6, color: '#16a34a', fillColor: '#16a34a', fillOpacity: 1 })
  //       .bindTooltip(`Inicio ${puntos[0].ts ?? ''}`, { direction: 'top' })
  //       .addTo(this.mapRuta);

  //     L.circleMarker(latlngs[latlngs.length - 1], { radius: 6, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1 })
  //       .bindTooltip(`Fin ${puntos[puntos.length - 1].ts ?? ''}`, { direction: 'top' })
  //       .addTo(this.mapRuta);

  //     this.mapRuta.fitBounds(poly.getBounds(), { padding: [20, 20] });

  //     // Corrige tamaño si el diálogo estaba oculto
  //     setTimeout(() => this.mapRuta!.invalidateSize(), 0);
  // }

  // // private normalizePuntos(raw: any[]): { lat: number; lng: number; ts?: string }[] {
  // //   const pts = (raw || []).map((p: any) => ({
  // //     lat: Number(p.n_latitud),
  // //     lng: Number(p.n_longitud),
  // //     ts:  p.timestamp
  // //   }));
  // //   return pts.filter((pt, i, arr) =>
  // //     i === 0 || pt.lat !== arr[i - 1].lat || pt.lng !== arr[i - 1].lng
  // //   );
  // // }

  // //Normaliza y parsea timestamp a milisegundos. Devuelve NaN si no hay ts o no parsea.
  // //"2025-08-16 16:40:20" -> ms (UTC). Devuelve NaN si no parsea.
  // private parseTs(ts?: string): number {
  //   if (!ts) return NaN;
  //   const t = ts.trim().replace(/\s+/g, ' ');   // limpia dobles espacios
  //   const [d, h] = t.split(' ');
  //   if (!d || !h) return NaN;
  //   const [yy, mm, dd] = d.split('-').map(Number);
  //   const [HH, MM, SS = 0] = h.split(':').map(Number);
  //   if ([yy, mm, dd, HH, MM].some(v => Number.isNaN(v))) return NaN;
  //   return Date.UTC(yy, (mm - 1), dd, HH, MM, SS);
  // }

  // private calcRutaStats(puntos: { lat: number; lng: number; ts?: string }[]) {
  //   const n = puntos.length;
  //   if (n < 2) {
  //     return { km: 0, n, durMin: 0, avgKmh: 0 };
  //   }

  //   // Distancia total (km)
  //   let totalKm = 0;
  //   for (let i = 1; i < n; i++) {
  //     totalKm += this.haversineKm(
  //       puntos[i - 1].lat, puntos[i - 1].lng,
  //       puntos[i].lat,     puntos[i].lng
  //     );
  //   }

  //   // Duración (min)
  //   const t0 = this.parseTs(puntos[0].ts);
  //   const t1 = this.parseTs(puntos[n - 1].ts);
  //   const durMin = (!Number.isNaN(t0) && !Number.isNaN(t1))
  //     ? Math.max(0, (t1 - t0) / 60000)
  //     : 0;

  //   const avgKmh = durMin > 0 ? (totalKm / (durMin / 60)) : 0;

  //   return {
  //     km: Math.round(totalKm * 100) / 100,
  //     n,
  //     durMin: Math.round(durMin * 10) / 10,
  //     avgKmh: Math.round(avgKmh * 10) / 10
  //   };
  // }

  // private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  //   const R = 6371; // km
  //   const toRad = (x: number) => x * Math.PI / 180;
  //   const dLat = toRad(lat2 - lat1);
  //   const dLon = toRad(lon2 - lon1);
  //   const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  //   return 2 * R * Math.asin(Math.sqrt(a));
  // }



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

  
}
