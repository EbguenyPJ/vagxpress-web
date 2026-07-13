import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { EmbarqueResumen } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export interface DetalleEmbarque {
  embarque: EmbarqueResumen;
  entradas: Record<string, unknown>[];
  pendientes: Record<string, unknown>[];
  factura: { s_evidencia_embarque: string; id_tipo_evidencia: number } | null;
  base64: string;
}

export interface AprobarEmbarquePayload {
  entradas?: { id_refaccion: number; n_cantidad: number; n_precio_compra: number }[];
  pendientes?: Record<string, unknown>[];
}

@Injectable({ providedIn: 'root' })
export class EmbarqueService extends ApiBase {
  getAllEmbarques(): Observable<ApiResponse<EmbarqueResumen[]>> {
    return this.http.get<ApiResponse<EmbarqueResumen[]>>(`${this.apiUrl}/embarques`);
  }

  getEmbarque(idEmbarque: number): Observable<ApiResponse<DetalleEmbarque>> {
    return this.http.get<ApiResponse<DetalleEmbarque>>(`${this.apiUrl}/embarques/${idEmbarque}`);
  }

  aprobarEmbarque(idEmbarque: number, payload: AprobarEmbarquePayload): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/embarques/${idEmbarque}/aprobar`, payload);
  }

  rechazarEmbarque(idEmbarque: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/embarques/${idEmbarque}/rechazar`, {});
  }

  getRefaccionesInsertadas(): Observable<ApiResponse<Record<string, unknown>[]>> {
    return this.http.get<ApiResponse<Record<string, unknown>[]>>(`${this.apiUrl}/embarques/refacciones-insertadas`);
  }

  getEmbarquesRefaccion(idRefaccion: number): Observable<ApiResponse<Record<string, unknown>[]>> {
    return this.http.get<ApiResponse<Record<string, unknown>[]>>(`${this.apiUrl}/embarques/refaccion/${idRefaccion}`);
  }

  getEmbarquesPreRegistro(idPreRegistro: number): Observable<ApiResponse<Record<string, unknown>[]>> {
    return this.http.get<ApiResponse<Record<string, unknown>[]>>(`${this.apiUrl}/embarques/pre-registro/${idPreRegistro}`);
  }
}
