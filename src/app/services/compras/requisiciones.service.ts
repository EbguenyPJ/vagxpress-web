import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class RequisicionesService {

  constructor(private http: HttpClient) { }

  getRequisiciones(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-requisiciones';
    return this.http.get(url, params);
  }

  getDetalleRequisicion(s_token: string, id_requisicion: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-requisicion/' + id_requisicion;
    return this.http.get(url, params);
  }
}
