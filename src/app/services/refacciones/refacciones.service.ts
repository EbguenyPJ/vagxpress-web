import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root',
})
export class RefaccionesService {
  constructor(private http: HttpClient) {}

  getRefacciones(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: s_token,
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-refacciones';
    return this.http.get(url, params);
  }
}
