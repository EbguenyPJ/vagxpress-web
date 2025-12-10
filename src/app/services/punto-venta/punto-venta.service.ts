import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { conexion } from 'app/conexion';

@Injectable({
  providedIn: 'root'
})
export class PuntoVentaService {

  constructor(private http: HttpClient) { }

  getCategorias(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-categorias-refacciones';
    return this.http.get(url, params);
  }

  getSubcategorias(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-subcategorias-refacciones';
    return this.http.get(url, params);
  }

  getProductos(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-refacciones';
    return this.http.get(url, params);
  }

  crearVenta(s_token: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'crear-venta';
    let options = { headers: headers };
    return this.http.post(url, data, options);
  }
}
