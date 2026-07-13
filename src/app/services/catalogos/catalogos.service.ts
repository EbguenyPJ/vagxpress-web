import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { FilaCatalogo } from '@core/models/dominio';
import { ApiBase } from '../api-base';

/** Catálogos de solo lectura: GET /catalogos/{slug}. */
@Injectable({ providedIn: 'root' })
export class CatalogosService extends ApiBase {
  obtener(catalogo: string): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/catalogos/${catalogo}`);
  }

  /** @deprecated Alias legado; usar obtener(). */
  GetAll(catalogo: string): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.obtener(catalogo);
  }
}
