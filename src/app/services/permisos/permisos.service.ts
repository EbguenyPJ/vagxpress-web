import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { ModuloUsuario } from '@core/models/dominio';
import { ApiBase } from '../api-base';

@Injectable({ providedIn: 'root' })
export class PermisosService extends ApiBase {
  getModulosDisponibles(): Observable<ApiResponse<ModuloUsuario[]>> {
    return this.http.get<ApiResponse<ModuloUsuario[]>>(`${this.apiUrl}/modulos`);
  }

  getModulosUsuario(idUsuario: number): Observable<ApiResponse<ModuloUsuario[]>> {
    return this.http.get<ApiResponse<ModuloUsuario[]>>(`${this.apiUrl}/usuarios/${idUsuario}/modulos`);
  }

  actualizarModulosUsuario(idUsuario: number, modulos: number[]): Observable<ApiResponse<ModuloUsuario[]>> {
    return this.http.put<ApiResponse<ModuloUsuario[]>>(`${this.apiUrl}/usuarios/${idUsuario}/modulos`, { modulos });
  }
}
