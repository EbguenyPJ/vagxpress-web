import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class RepartosService {

  constructor(private http: HttpClient) { }

  getAllRepartos(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'repartos'
    return this.http.get(url, params);
  }


  getDetalleReparto(s_token: string, id_orden: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'detalle-reparto' + '/' + id_orden
    return this.http.get(url, params);
  }
}
