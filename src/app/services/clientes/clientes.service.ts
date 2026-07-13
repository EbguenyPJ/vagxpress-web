import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { Cliente, ClienteSelector, FilaCatalogo } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export type GuardarClientePayload = Partial<Omit<Cliente, 'id_cliente' | 'b_activo' | 'n_saldo_actual'>> & {
  s_nombre_cliente: string;
  id_tipo_cliente: number;
};

@Injectable({ providedIn: 'root' })
export class ClientesService extends ApiBase {
  getClientes(): Observable<ApiResponse<Cliente[]>> {
    return this.http.get<ApiResponse<Cliente[]>>(`${this.apiUrl}/clientes`);
  }

  /** Selector ligero del punto de venta (nombre + crédito disponible). */
  getSelector(): Observable<ApiResponse<ClienteSelector[]>> {
    return this.http.get<ApiResponse<ClienteSelector[]>>(`${this.apiUrl}/clientes/selector`);
  }

  /** @deprecated Catálogo genérico usado por el diálogo de alta; usar CatalogosService. */
  GetAll(catalogo: string): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/catalogos/${catalogo}`);
  }

  crearCliente(payload: GuardarClientePayload): Observable<ApiResponse<Cliente>> {
    return this.http.post<ApiResponse<Cliente>>(`${this.apiUrl}/clientes`, payload);
  }

  actualizarCliente(idCliente: number, payload: GuardarClientePayload): Observable<ApiResponse<Cliente>> {
    return this.http.put<ApiResponse<Cliente>>(`${this.apiUrl}/clientes/${idCliente}`, payload);
  }
}
