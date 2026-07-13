import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { FilaCatalogo, Gasto } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export interface CrearGastoPayload {
  id_tipo_gasto: number;
  s_concepto: string;
  n_costo?: number;
  n_cantidad?: number;
  id_sucursal?: number;
  d_fecha_gasto?: string;
  archivo?: { evidencia: string };
  extension?: string;
}

@Injectable({ providedIn: 'root' })
export class GastosService extends ApiBase {
  getGastos(): Observable<ApiResponse<Gasto[]>> {
    return this.http.get<ApiResponse<Gasto[]>>(`${this.apiUrl}/gastos`);
  }

  crearGasto(payload: CrearGastoPayload): Observable<ApiResponse<{ id_gasto: number }>> {
    return this.http.post<ApiResponse<{ id_gasto: number }>>(`${this.apiUrl}/gastos`, payload);
  }

  getTiposGastos(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/gastos/tipos`);
  }

  crearTipoGasto(idCategoriaGasto: number, sTipoGasto: string): Observable<ApiResponse<FilaCatalogo>> {
    return this.http.post<ApiResponse<FilaCatalogo>>(`${this.apiUrl}/gastos/tipos`, {
      id_categoria_gasto: idCategoriaGasto,
      s_tipo_gasto: sTipoGasto,
    });
  }

  getCategoriasGastos(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/gastos/categorias`);
  }
}
