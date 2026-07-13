import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { OrdenReparto } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export interface DetalleReparto {
  orden: OrdenReparto & { productos: Record<string, unknown>[] };
  evidencias_salida_reparto: { s_evidencia_orden: string }[];
  evidencias_fin_reparto: { s_evidencia_orden: string }[];
  ruta_salida: { n_latitud: string | number; n_longitud: string | number; timestamp: string }[];
  ruta_regreso: { n_latitud: string | number; n_longitud: string | number; timestamp: string }[];
}

@Injectable({ providedIn: 'root' })
export class RepartosService extends ApiBase {
  getRepartos(): Observable<ApiResponse<OrdenReparto[]>> {
    return this.http.get<ApiResponse<OrdenReparto[]>>(`${this.apiUrl}/repartos`);
  }

  getOrdenesPendientes(): Observable<ApiResponse<OrdenReparto[]>> {
    return this.http.get<ApiResponse<OrdenReparto[]>>(`${this.apiUrl}/repartos/ordenes-pendientes`);
  }

  getRepartidores(): Observable<ApiResponse<{ id: number; s_nombre_completo: string }[]>> {
    return this.http.get<ApiResponse<{ id: number; s_nombre_completo: string }[]>>(`${this.apiUrl}/repartos/repartidores`);
  }

  asignarOrden(idOrden: number, idRepartidor: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/repartos/asignar`, {
      id_orden: idOrden,
      id_repartidor: idRepartidor,
    });
  }

  getDetalleReparto(idOrden: number): Observable<ApiResponse<DetalleReparto>> {
    return this.http.get<ApiResponse<DetalleReparto>>(`${this.apiUrl}/repartos/${idOrden}`);
  }
}
