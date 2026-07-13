import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { ApiBase } from '../api-base';
import { ReglaCompatibilidadPayload } from '../refacciones/refacciones.service';

export interface CatalogosVehiculos {
  marcas: { id_marca_vehiculo: number; s_marca_vehiculo: string }[];
  modelos: { id_modelo_vehiculo: number; id_marca_vehiculo: number; s_modelo_vehiculo: string }[];
  generaciones: { id_generacion: number; id_modelo_vehiculo: number; s_generacion: string; n_anio_inicio: number | null; n_anio_fin: number | null }[];
  motores: { id_motor: number; s_motor: string }[];
}

export interface ReglaCompatibilidad {
  id_regla: number;
  s_resumen: string | null;
  b_universal: boolean;
  marcas: string[];
  modelos: string[];
  generaciones: string[];
  motores: string[];
}

export interface VehiculoConsulta {
  id_marca_vehiculo?: number | null;
  id_modelo_vehiculo?: number | null;
  id_generacion?: number | null;
  id_motor?: number | null;
}

@Injectable({ providedIn: 'root' })
export class CompatibilidadService extends ApiBase {
  getCatalogosVehiculos(): Observable<ApiResponse<CatalogosVehiculos>> {
    return this.http.get<ApiResponse<CatalogosVehiculos>>(`${this.apiUrl}/compatibilidad/catalogos-vehiculos`);
  }

  crearRegla(idRefaccion: number, regla: ReglaCompatibilidadPayload): Observable<ApiResponse<{ id_regla: number }>> {
    return this.http.post<ApiResponse<{ id_regla: number }>>(`${this.apiUrl}/compatibilidad/reglas`, {
      id_refaccion: idRefaccion,
      ...regla,
    });
  }

  getReglas(idRefaccion: number): Observable<ApiResponse<ReglaCompatibilidad[]>> {
    return this.http.get<ApiResponse<ReglaCompatibilidad[]>>(`${this.apiUrl}/compatibilidad/reglas/refaccion/${idRefaccion}`);
  }

  eliminarRegla(idRegla: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/compatibilidad/reglas/${idRegla}`);
  }

  buscarCompatibles(vehiculo: VehiculoConsulta): Observable<ApiResponse<unknown[]>> {
    return this.http.post<ApiResponse<unknown[]>>(`${this.apiUrl}/compatibilidad/buscar-compatibles`, vehiculo);
  }
}
