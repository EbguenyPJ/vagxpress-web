import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { Venta } from '@core/models/dominio';
import { ApiBase } from '../api-base';

@Injectable({ providedIn: 'root' })
export class BitacoraVentasService extends ApiBase {
  getVentas(): Observable<ApiResponse<Venta[]>> {
    return this.http.get<ApiResponse<Venta[]>>(`${this.apiUrl}/ventas`);
  }

  getVentaById(idVenta: number): Observable<ApiResponse<Venta>> {
    return this.http.get<ApiResponse<Venta>>(`${this.apiUrl}/ventas/${idVenta}`);
  }
}
