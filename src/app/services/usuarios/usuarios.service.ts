import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  getUsuarios(s_token: string)
  {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': s_token
     });
    let params = { headers: headers };
    let url = conexion.url + 'listar-usuarios'
    return this.http.get(url, params);
  }


  getPerfilUsuario(s_token: string, id_usuario:number)
  {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': s_token
     });
    let params = { headers: headers };
    let url = conexion.url + 'perfil-de-usuario/'+id_usuario
    return this.http.get(url, params);
  }


  crearUsuario(s_token:string, data: any)
  {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json; multipart/form-data',
        'Token': s_token
     });
     let url = conexion.url + 'registrar-usuario'
    let options = { headers: headers };

    return this.http.post(url, data, options);
  }


}
