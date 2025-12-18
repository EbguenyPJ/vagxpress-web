import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class EmbarqueService {

  constructor(private http: HttpClient) { }


  getAllEmbarques(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-embarques'
    return this.http.get(url, params);
  }


  getEmbarque(s_token: string, id_embarque: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-embarque' + '/' + id_embarque
    return this.http.get(url, params);
  }


  aprobarEmbarque(s_token: string, data: any, id_embarque: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'aprobar-embarque' + '/' + id_embarque;
    return this.http.post(url, data, { headers });
  }

  rechazarEmbarque(s_token: string, data: any, id_embarque: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'rechazar-embarque' + '/' + id_embarque;
    return this.http.post(url, data, { headers });
  }
}
