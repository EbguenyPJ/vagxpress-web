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
 * "Constructor de Reglas" de compatibilidad vehicular.
 * Multi-selección en cascada (marca → modelo → generación) + motores.
 * Devuelve una regla; dejar todo vacío produce una regla universal.
 */
@Component({
  selector: 'app-dialog-constructor-regla',
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
  templateUrl: './dialog-constructor-regla.component.html',
  styleUrls: ['./dialog-constructor-regla.component.scss'],
})
export class DialogConstructorReglaComponent implements OnInit {
  marcas: any[] = [];
  modelos: any[] = [];
  generaciones: any[] = [];
  motores: any[] = [];

  modelosFiltrados: any[] = [];
  generacionesFiltradas: any[] = [];

  marcasCtrl = new FormControl<number[]>([], { nonNullable: true });
  modelosCtrl = new FormControl<number[]>([], { nonNullable: true });
  generacionesCtrl = new FormControl<number[]>([], { nonNullable: true });
  motoresCtrl = new FormControl<number[]>([], { nonNullable: true });

  cargando = true;

  constructor(
    public dialogRef: MatDialogRef<DialogConstructorReglaComponent>,
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
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar catálogos vehiculares', err);
        this.cargando = false;
      },
    });

    this.marcasCtrl.valueChanges.subscribe(() => this.alCambiarMarcas());
    this.modelosCtrl.valueChanges.subscribe(() => this.alCambiarModelos());
  }

  /** Al cambiar marcas: recalcula modelos disponibles y poda los inválidos. */
  private alCambiarMarcas(): void {
    const marcas = this.marcasCtrl.value;
    this.modelosFiltrados = marcas.length
      ? this.modelos.filter((m) => marcas.includes(m.id_marca_vehiculo))
      : [];

    const validos = this.modelosFiltrados.map((m) => m.id_modelo_vehiculo);
    const podados = this.modelosCtrl.value.filter((id) => validos.includes(id));
    if (podados.length !== this.modelosCtrl.value.length) {
      this.modelosCtrl.setValue(podados); // dispara alCambiarModelos
    } else {
      this.alCambiarModelos();
    }
  }

  /** Al cambiar modelos: recalcula generaciones disponibles y poda las inválidas. */
  private alCambiarModelos(): void {
    const modelos = this.modelosCtrl.value;
    this.generacionesFiltradas = modelos.length
      ? this.generaciones.filter((g) => modelos.includes(g.id_modelo_vehiculo))
      : [];

    const validos = this.generacionesFiltradas.map((g) => g.id_generacion);
    const podados = this.generacionesCtrl.value.filter((id) =>
      validos.includes(id)
    );
    if (podados.length !== this.generacionesCtrl.value.length) {
      this.generacionesCtrl.setValue(podados, { emitEvent: false });
    }
  }

  private nombres(
    lista: any[],
    ids: number[],
    idKey: string,
    nameKey: string
  ): string[] {
    return ids
      .map((id) => lista.find((x) => x[idKey] === id)?.[nameKey])
      .filter((n): n is string => !!n);
  }

  /** Resumen legible en vivo. Vacío en todo = universal. */
  get resumen(): string {
    const marcas = this.nombres(this.marcas, this.marcasCtrl.value, 'id_marca_vehiculo', 's_marca_vehiculo');
    const modelos = this.nombres(this.modelos, this.modelosCtrl.value, 'id_modelo_vehiculo', 's_modelo_vehiculo');
    const generaciones = this.nombres(this.generaciones, this.generacionesCtrl.value, 'id_generacion', 's_generacion');
    const motores = this.nombres(this.motores, this.motoresCtrl.value, 'id_motor', 's_motor');

    if (!marcas.length && !modelos.length && !generaciones.length && !motores.length) {
      return 'Regla universal — compatible con cualquier vehículo.';
    }

    const partes: string[] = [];
    if (marcas.length) partes.push(marcas.join(' o '));
    if (modelos.length) partes.push(modelos.join(' o '));
    if (generaciones.length) partes.push(generaciones.join(' o '));
    if (motores.length) partes.push(motores.join(' o '));
    return 'Compatible con: ' + partes.join(' · ');
  }

  get esUniversal(): boolean {
    return (
      !this.marcasCtrl.value.length &&
      !this.modelosCtrl.value.length &&
      !this.generacionesCtrl.value.length &&
      !this.motoresCtrl.value.length
    );
  }

  guardar(): void {
    this.dialogRef.close({
      id_marcas: this.marcasCtrl.value,
      id_modelos: this.modelosCtrl.value,
      id_generaciones: this.generacionesCtrl.value,
      id_motores: this.motoresCtrl.value,
      s_resumen: this.resumen,
      // etiquetas para pintar la tarjeta sin re-consultar el backend
      _labels: {
        marcas: this.nombres(this.marcas, this.marcasCtrl.value, 'id_marca_vehiculo', 's_marca_vehiculo'),
        modelos: this.nombres(this.modelos, this.modelosCtrl.value, 'id_modelo_vehiculo', 's_modelo_vehiculo'),
        generaciones: this.nombres(this.generaciones, this.generacionesCtrl.value, 'id_generacion', 's_generacion'),
        motores: this.nombres(this.motores, this.motoresCtrl.value, 'id_motor', 's_motor'),
        universal: this.esUniversal,
      },
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
