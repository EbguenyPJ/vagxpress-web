import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private http: HttpClient) { }


    getModulosDisponibles(s_token: string = '') {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    const params = { headers: headers };
    const url = conexion.url + 'modulos-disponibles';
    return this.http.get(url, params);
  }


    getModulosUsuario(s_token: string, id_usuario: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    const params = { headers: headers };
    const url = conexion.url + 'modulos-usuario/' + id_usuario;
    return this.http.get(url, params);
  }
  
    actualizarModulosUsuario(s_token: string, id_usuario: number, modulos: number[]) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    const url = conexion.url + 'modulos/actualizar-modulos-usuario/' + id_usuario;
    const options = { headers: headers };
    
    return this.http.put(url, { modulos }, options);
  }

  ActualizarWebMovil(s_token: string, id_usuario: number, web?: number, movil?: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'user/actualizar-modulo-web-movil/' + id_usuario;

    const body: any = {};
    if (web !== undefined) body.b_usuario_web = web;
    if (movil !== undefined) body.b_usuario_movil = movil;

    return this.http.put(url, body, { headers });
  }

}
