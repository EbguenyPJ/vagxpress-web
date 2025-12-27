import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class OrdenesCompraService {

  constructor(private http: HttpClient) { }

  getOrdenesCompra(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-ordenes-compras';
    return this.http.get(url, params);
  }

  getOrdenCompra(s_token: string, id_orden_compra: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-orden-compra/' + id_orden_compra;
    return this.http.get(url, params);
  }

  gestionarOrdenCompra(s_token: string, id_orden_compra: number, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'gestionar-orden-compra/' + id_orden_compra;
    let options = { headers: headers };
    return this.http.put(url, data, options);
  }

  descargarOrdenCompraPdf(s_token: string, id_orden_compra: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'descargar-orden-compra-pdf/' + id_orden_compra;
    return this.http.get(url, params);
  }
}
