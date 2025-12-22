import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { conexion } from '../../conexion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CortesService {

  constructor(private http: HttpClient) { }

getVentasCorte(s_token: string, fechaHora?: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': s_token
  });

  let url = conexion.url + 'ventas-corte';
  if (fechaHora) {
    url += '?fecha=' + encodeURIComponent(fechaHora); 
  }

  return this.http.get(url, { headers: headers });
}

getCorteCajaDesglosado(s_token: string, fechaHora?: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': s_token
  });

  let url = conexion.url + 'corte-caja-desglosado';
  if (fechaHora) {
    url += '?fecha=' + encodeURIComponent(fechaHora); 
  }

  return this.http.get(url, { headers: headers });
}





}
