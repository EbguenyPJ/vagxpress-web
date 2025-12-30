import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  getClientes(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-clientes';
    return this.http.get(url, params);
  }

  getCliente(s_token: string, id_cliente: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-cliente/' + id_cliente;
    return this.http.get(url, params);
  }

  crearCliente(s_token: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'crear-cliente';
    let options = { headers: headers };
    return this.http.post(url, data, options);
  }

  actualizarCliente(s_token: string, id_cliente: number, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'actualizar-cliente/' + id_cliente;
    let options = { headers: headers };
    return this.http.put(url, data, options);
  }

  eliminarCliente(s_token: string, id_cliente: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let options = { headers: headers };
    let url = conexion.url + 'eliminar-cliente/' + id_cliente;
    return this.http.delete(url, options);
  }
}
