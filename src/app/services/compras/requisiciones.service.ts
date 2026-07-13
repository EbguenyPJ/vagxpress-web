import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { RequisicionListado } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export interface RenglonRequisicion {
  id_requisicion: number;
  id_requisicion_refaccion: number;
  id_refaccion: number;
  s_nombre_refaccion: string | null;
  s_numero_parte: string | null;
  n_costo_unitario: string | number | null;
  n_precio_venta: string | number | null;
  n_stock_actual: number | null;
  n_tiempo_reposicion: number | null;
  n_cantidad_sugerida: number;
  id_motivo_pedido: number | null;
  s_motivo_pedido: string | null;
  id_prioridad: number | null;
  s_prioridad: string | null;
  id_estatus_requisicion: number;
  s_estatus_requisicion: string | null;
}

export interface GrupoProveedorRequisicion {
  id_proveedor: number | null;
  s_proveedor: string;
  total_estimado_proveedor: number;
  cantidad_refacciones_proveedor: number;
  items: (RenglonRequisicion & {
    costo_estimado_refaccion: number;
    alerta_mejor_precio: boolean;
    mejor_opcion: { id_proveedor: number; s_proveedor: string | null; n_ultimo_costo: string | number; d_fecha_ultima_compra: string | null; n_ahorro_unitario: number } | null;
  })[];
}

@Injectable({ providedIn: 'root' })
export class RequisicionesService extends ApiBase {
  getRequisiciones(): Observable<ApiResponse<RequisicionListado[]>> {
    return this.http.get<ApiResponse<RequisicionListado[]>>(`${this.apiUrl}/requisiciones`);
  }

  getRequisicionById(idRequisicion: number): Observable<ApiResponse<RenglonRequisicion[]>> {
    return this.http.get<ApiResponse<RenglonRequisicion[]>>(`${this.apiUrl}/requisiciones/${idRequisicion}`);
  }

  actualizarEstatus(idRequisicion: number, idEstatus: number): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${this.apiUrl}/requisiciones/${idRequisicion}`, {
      id_estatus_requisicion: idEstatus,
    });
  }

  getPorProveedor(idRequisicion: number): Observable<ApiResponse<GrupoProveedorRequisicion[]>> {
    return this.http.get<ApiResponse<GrupoProveedorRequisicion[]>>(`${this.apiUrl}/requisiciones/${idRequisicion}/por-proveedor`);
  }
}
