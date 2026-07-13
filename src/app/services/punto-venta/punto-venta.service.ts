import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { ClienteSelector, FilaCatalogo, RefaccionListado } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export interface RenglonVentaPayload {
  id_refaccion: number;
  n_cantidad: number;
  id_porcentaje_utilidad?: number | null;
}

export interface CrearVentaPayload {
  id_cliente: number;
  id_metodo_pago: number;
  id_cuenta_bancaria?: number | null;
  refacciones: RenglonVentaPayload[];
}

export interface VentaCreada {
  status: string;
  message: string;
  data: unknown[];
  ticket_base64: string;
}

@Injectable({ providedIn: 'root' })
export class PuntoVentaService extends ApiBase {
  getCategorias(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/catalogos/categorias-refacciones`);
  }

  getSubcategorias(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/catalogos/subcategorias-refacciones`);
  }

  getProductos(): Observable<ApiResponse<RefaccionListado[]>> {
    return this.http.get<ApiResponse<RefaccionListado[]>>(`${this.apiUrl}/refacciones`);
  }

  getPorcentajesUtilidad(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/catalogos/porcentajes-utilidad`);
  }

  getMetodosPago(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/catalogos/metodos-pago`);
  }

  getClientes(): Observable<ApiResponse<ClienteSelector[]>> {
    return this.http.get<ApiResponse<ClienteSelector[]>>(`${this.apiUrl}/clientes/selector`);
  }

  getCuentasBancarias(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/catalogos/cuentas-bancarias`);
  }

  crearVenta(payload: CrearVentaPayload): Observable<VentaCreada> {
    return this.http.post<VentaCreada>(`${this.apiUrl}/ventas`, payload);
  }
}
