import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { Corte } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export interface CrearCortePayload {
  id_tipo_corte: number;
  fecha_corte: string;
  monto_efectivo?: number;
  monto_transferencia?: number;
  monto_credito?: number;
  monto_tarjeta_debito?: number;
  monto_tarjeta_credito?: number;
  descripcion?: string | null;
  comentario?: string | null;
}

export interface VentaDelDia {
  id_venta: number;
  n_total: string | number;
  metodo_pago: string | null;
  cliente: string | null;
  telefono: string | null;
  correo: string | null;
  created_at: string;
}

export interface VentasCorteRespuesta {
  status: string;
  message: string;
  total_dia: number;
  data: VentaDelDia[];
}

export interface DesglosadoCorte {
  resumen: { id_metodo_pago: number; s_nombre_metodo: string; id_ventas: string; total_ventas: number; total_dinero: string | number }[];
  desglose_bancos: { id_metodo_pago: number; s_nombre_metodo: string; cuenta: string; id_ventas: string; total_ventas: number; total_dinero: string | number }[];
  total_general: number;
}

@Injectable({ providedIn: 'root' })
export class CortesService extends ApiBase {
  getCortes(): Observable<ApiResponse<Corte[]>> {
    return this.http.get<ApiResponse<Corte[]>>(`${this.apiUrl}/cortes`);
  }

  getCorteById(idCorte: number): Observable<ApiResponse<{ corte: Corte; evidencias: unknown[] }>> {
    return this.http.get<ApiResponse<{ corte: Corte; evidencias: unknown[] }>>(`${this.apiUrl}/cortes/${idCorte}`);
  }

  crearCorte(payload: CrearCortePayload): Observable<{ status: string; message: string; data: { id_corte: number; total_usuario: number; total_ventas: number; diferencia: number; ventas_corte: unknown[] } }> {
    return this.http.post<{ status: string; message: string; data: { id_corte: number; total_usuario: number; total_ventas: number; diferencia: number; ventas_corte: unknown[] } }>(`${this.apiUrl}/cortes`, payload);
  }

  subirEvidencias(formData: FormData): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/cortes/evidencias`, formData);
  }

  cerrarCorte(idCorte: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/cortes/${idCorte}/cerrar`, {});
  }

  getVentasCorte(fechaHora?: string): Observable<VentasCorteRespuesta> {
    const params = fechaHora ? { params: { fechaHora } } : {};
    return this.http.get<VentasCorteRespuesta>(`${this.apiUrl}/ventas/corte`, params);
  }

  getCorteCajaDesglosado(fechaHora?: string): Observable<ApiResponse<DesglosadoCorte>> {
    const params = fechaHora ? { params: { fechaHora } } : {};
    return this.http.get<ApiResponse<DesglosadoCorte>>(`${this.apiUrl}/cortes/desglosado`, params);
  }
}
