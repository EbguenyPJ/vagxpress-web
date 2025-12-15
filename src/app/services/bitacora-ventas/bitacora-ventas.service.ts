import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { conexion } from 'app/conexion';

@Injectable({
  providedIn: 'root'
})
export class BitacoraVentasService {

  constructor(private http: HttpClient) { }

  getVentas(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-ventas';
    return this.http.get(url, params);
  }
}
