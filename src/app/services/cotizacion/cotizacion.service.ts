import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { ApiBase } from '../api-base';
import { RenglonVentaPayload } from '../punto-venta/punto-venta.service';

export interface CrearCotizacionPayload {
  id_cliente: number;
  id_tipo_cotizacion?: number;
  refacciones: RenglonVentaPayload[];
}

@Injectable({ providedIn: 'root' })
export class CotizacionService extends ApiBase {
  crearCotizacion(payload: CrearCotizacionPayload): Observable<ApiResponse<unknown[]>> {
    return this.http.post<ApiResponse<unknown[]>>(`${this.apiUrl}/cotizaciones`, payload);
  }
}
