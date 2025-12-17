import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  getClientes(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'cliente/listar-clientes'
    return this.http.get(url, params);
  }


  GetAll(s_token: string, ruta: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + ruta
    return this.http.get(url, params);
  }

  crearCliente(s_token: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'cliente/crear-cliente';
    return this.http.post(url, data, { headers });
  }


  actualizarCliente(s_token: string, id: number, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'cliente/actualizar-cliente/' + id;
    return this.http.put(url, data, { headers });
  }


}
