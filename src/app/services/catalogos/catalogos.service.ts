import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(private http: HttpClient) { }


  GetAll(s_token: string, ruta: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + ruta
    return this.http.get(url, params);
  }


    GetById(s_token: string, ruta: string, id: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + ruta + '/' + id
    return this.http.get(url, params);
  }


  Post(s_token: string, ruta: any, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + ruta
    let options = { headers: headers };
    return this.http.post(url, data, options);
  }


  Update(s_token: string, ruta: any, data: any, id: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': s_token
    });
    let options = { headers: headers };
    let url = conexion.url + ruta + '/' + id
    return this.http.put(url, data, options);
  }

}
