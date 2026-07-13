import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { Proveedor } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export type GuardarProveedorPayload = Partial<Omit<Proveedor, 'id_proveedor' | 'b_activo'>> & {
  s_proveedor: string;
};

@Injectable({ providedIn: 'root' })
export class ProveedoresService extends ApiBase {
  getProveedores(): Observable<ApiResponse<Proveedor[]>> {
    return this.http.get<ApiResponse<Proveedor[]>>(`${this.apiUrl}/proveedores`);
  }

  crearProveedor(payload: GuardarProveedorPayload): Observable<ApiResponse<Proveedor>> {
    return this.http.post<ApiResponse<Proveedor>>(`${this.apiUrl}/proveedores`, payload);
  }

  actualizarProveedor(idProveedor: number, payload: GuardarProveedorPayload): Observable<ApiResponse<Proveedor>> {
    return this.http.put<ApiResponse<Proveedor>>(`${this.apiUrl}/proveedores/${idProveedor}`, payload);
  }
}
