import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { FilaCatalogo, ModuloUsuario } from '@core/models/dominio';
import { ApiBase } from 'app/services/api-base';

/** Datos que alimentan el menú lateral: módulos del usuario y sus categorías. */
@Injectable({ providedIn: 'root' })
export class SidebarService extends ApiBase {
  getUserModules(idUsuario: number): Observable<ApiResponse<ModuloUsuario[]>> {
    return this.http.get<ApiResponse<ModuloUsuario[]>>(`${this.apiUrl}/usuarios/${idUsuario}/modulos`);
  }

  getCategoriasModulos(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/modulos/categorias`);
  }
}
