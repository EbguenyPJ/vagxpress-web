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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CompatibilidadService } from 'app/services/compatibilidad/compatibilidad.service';

/**
 * Búsqueda de refacciones por vehículo (POS). Cascada marca → modelo →
 * generación → motor; consume el motor de match `buscarCompatibles`. Al elegir
 * un resultado, cierra devolviendo la refacción para agregarla al carrito.
 */
@Component({
  selector: 'app-dialog-buscar-vehiculo',
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
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dialog-buscar-vehiculo.component.html',
  styleUrls: ['./dialog-buscar-vehiculo.component.scss'],
})
export class DialogBuscarVehiculoComponent implements OnInit {
  marcas: any[] = [];
  modelos: any[] = [];
  generaciones: any[] = [];
  motores: any[] = [];

  modelosFiltrados: any[] = [];
  generacionesFiltradas: any[] = [];

  marcaCtrl = new FormControl<number | null>(null);
  modeloCtrl = new FormControl<number | null>(null);
  generacionCtrl = new FormControl<number | null>(null);
  motorCtrl = new FormControl<number | null>(null);

  cargandoCatalogos = true;
  buscando = false;
  yaBusco = false;
  resultados: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogBuscarVehiculoComponent>,
    private compatibilidadService: CompatibilidadService
  ) {}

  ngOnInit(): void {
    this.compatibilidadService.getCatalogosVehiculos().subscribe({
      next: (res: any) => {
        const d = res?.data || {};
        this.marcas = d.marcas || [];
        this.modelos = d.modelos || [];
        this.generaciones = d.generaciones || [];
        this.motores = d.motores || [];
        this.cargandoCatalogos = false;
      },
      error: (err: any) => {
        console.error('Error al cargar catálogos vehiculares', err);
        this.cargandoCatalogos = false;
      },
    });

    this.marcaCtrl.valueChanges.subscribe((idMarca) => {
      this.modelosFiltrados = idMarca
        ? this.modelos.filter((m) => m.id_marca_vehiculo === idMarca)
        : [];
      this.modeloCtrl.setValue(null);
    });

    this.modeloCtrl.valueChanges.subscribe((idModelo) => {
      this.generacionesFiltradas = idModelo
        ? this.generaciones.filter((g) => g.id_modelo_vehiculo === idModelo)
        : [];
      this.generacionCtrl.setValue(null);
    });
  }

  buscar(): void {
    if (!this.marcaCtrl.value) {
      return;
    }
    this.buscando = true;
    this.compatibilidadService
      .buscarCompatibles({
        id_marca_vehiculo: this.marcaCtrl.value,
        id_modelo_vehiculo: this.modeloCtrl.value,
        id_generacion: this.generacionCtrl.value,
        id_motor: this.motorCtrl.value,
      })
      .subscribe({
        next: (res: any) => {
          this.resultados = res?.data || [];
          this.buscando = false;
          this.yaBusco = true;
        },
        error: (err: any) => {
          console.error('Error al buscar refacciones compatibles', err);
          this.resultados = [];
          this.buscando = false;
          this.yaBusco = true;
        },
      });
  }

  seleccionar(refaccion: any): void {
    this.dialogRef.close(refaccion);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
