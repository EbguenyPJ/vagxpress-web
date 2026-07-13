import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { OrdenCompraListado } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export interface GenerarOrdenesPayload {
  ordenes: {
    id_requisicion: number;
    id_proveedor?: number | null;
    refacciones: { id_requisicion_refaccion: number; b_autorizada: 0 | 1 }[];
  }[];
}

export interface GestionarOrdenPayload {
  id_estatus_orden_compra: number; // 2=Aprobada, 3=Rechazada
  refacciones: { id_requisicion_refaccion: number; n_cantidad_solicitada: number }[];
}

export interface RenglonOrdenCompra {
  id_orden_compra_requisicion_refaccion: number;
  s_nombre_refaccion: string | null;
  s_numero_parte: string | null;
  id_requisicion_refaccion: number;
  n_cantidad_sugerida: number | null;
  n_cantidad_solicitada: number | null;
  n_costo_unitario: string | number | null;
  id_motivo_pedido: number | null;
  s_motivo_pedido: string | null;
  id_prioridad: number | null;
  s_prioridad: string | null;
}

@Injectable({ providedIn: 'root' })
export class OrdenesCompraService extends ApiBase {
  getOrdenesCompra(): Observable<ApiResponse<OrdenCompraListado[]>> {
    return this.http.get<ApiResponse<OrdenCompraListado[]>>(`${this.apiUrl}/ordenes-compra`);
  }

  getOrdenCompraById(idOrdenCompra: number): Observable<ApiResponse<RenglonOrdenCompra[]>> {
    return this.http.get<ApiResponse<RenglonOrdenCompra[]>>(`${this.apiUrl}/ordenes-compra/${idOrdenCompra}`);
  }

  generarOrdenes(payload: GenerarOrdenesPayload): Observable<ApiResponse<OrdenCompraListado[]>> {
    return this.http.post<ApiResponse<OrdenCompraListado[]>>(`${this.apiUrl}/ordenes-compra`, payload);
  }

  gestionarOrden(idOrdenCompra: number, payload: GestionarOrdenPayload): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/ordenes-compra/${idOrdenCompra}/gestionar`, payload);
  }

  descargarPdf(idOrdenCompra: number): Observable<ApiResponse<{ folio: string; file_base64: string }>> {
    return this.http.get<ApiResponse<{ folio: string; file_base64: string }>>(`${this.apiUrl}/ordenes-compra/${idOrdenCompra}/pdf`);
  }
}
