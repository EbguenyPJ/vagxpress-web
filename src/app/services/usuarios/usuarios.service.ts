import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { Usuario } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export interface RegistrarUsuarioPayload {
  id_empleado: number;
  name: string;
  password: string;
  id_tipo_usuario: number;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService extends ApiBase {
  getUsuarios(): Observable<ApiResponse<Usuario[]>> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.apiUrl}/usuarios`);
  }

  registrarUsuario(payload: RegistrarUsuarioPayload): Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(`${this.apiUrl}/usuarios`, payload);
  }

  getPerfil(idUsuario: number): Observable<ApiResponse<Usuario & Record<string, unknown>>> {
    return this.http.get<ApiResponse<Usuario & Record<string, unknown>>>(`${this.apiUrl}/usuarios/${idUsuario}/perfil`);
  }

  actualizarAccesos(idUsuario: number, accesos: { b_usuario_web?: 0 | 1; b_usuario_movil?: 0 | 1 }): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/usuarios/${idUsuario}/accesos`, accesos);
  }

  actualizarEstatus(idUsuario: number, activo: 0 | 1): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/usuarios/${idUsuario}/estatus`, { b_activo: activo });
  }

  actualizarTipoUsuario(idUsuario: number, idTipoUsuario: number): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/usuarios/${idUsuario}/tipo-usuario`, { id_tipo_usuario: idTipoUsuario });
  }
}
