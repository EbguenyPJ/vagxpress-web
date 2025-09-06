import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';


@Injectable({
  providedIn: 'root'
})

export class VersionesService {

  constructor(private http: HttpClient) { }

  getVersiones(s_token: string)
  {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': s_token
     });
    let params = { headers: headers };
    let url = conexion.url + 'versiones'
    return this.http.get(url, params);
  }

  getUltimaVersion(s_token: string)
  {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': s_token
     });
    let params = { headers: headers };
    let url = conexion.url + 'ultima-version'
    return this.http.get(url, params);
  }

  crearVersion(s_token:string, data: any)
  {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json; multipart/form-data',
        'Token': s_token
     });
     let url = conexion.url + 'crear-version'
    let options = { headers: headers };

    return this.http.post(url, data, options);
  }

  actualizarVersion(s_token:string, data: any, id_version: number)
  {
    console.log("este es la data: ", data);
    let headers = new HttpHeaders({
        'Content-Type': 'application/json; multipart/form-data',
        'Token': s_token
     });
     let url = conexion.url + 'actualizar-version' + '/' + id_version
    let options = { headers: headers };

    return this.http.post(url, data, options);
  }
}
