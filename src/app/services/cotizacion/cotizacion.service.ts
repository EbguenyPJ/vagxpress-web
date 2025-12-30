import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  constructor(private http: HttpClient) { }

  getCotizaciones(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-cotizaciones';
    return this.http.get(url, params);
  }

  getCotizacion(s_token: string, id_cotizacion: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-cotizacion/' + id_cotizacion;
    return this.http.get(url, params);
  }

  crearCotizacion(s_token: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'crear-cotizacion';
    let options = { headers: headers };
    return this.http.post(url, data, options);
  }

  actualizarCotizacion(s_token: string, id_cotizacion: number, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'actualizar-cotizacion/' + id_cotizacion;
    let options = { headers: headers };
    return this.http.put(url, data, options);
  }

  eliminarCotizacion(s_token: string, id_cotizacion: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let options = { headers: headers };
    let url = conexion.url + 'eliminar-cotizacion/' + id_cotizacion;
    return this.http.delete(url, options);
  }
}
