import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { FilaCatalogo } from '@core/models/dominio';
import { ApiBase } from './api-base';

@Injectable({ providedIn: 'root' })
export class VersionesService extends ApiBase {
  getVersiones(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/versiones`);
  }

  getUltimaVersion(): Observable<ApiResponse<FilaCatalogo | null>> {
    return this.http.get<ApiResponse<FilaCatalogo | null>>(`${this.apiUrl}/versiones/ultima`);
  }
}
