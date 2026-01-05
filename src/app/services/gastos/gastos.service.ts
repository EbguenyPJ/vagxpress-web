import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor(private http: HttpClient) { }


  getGastos(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    let options = { headers: headers };

    let url = conexion.url + 'gastos/obtener-gastos';
    return this.http.get(url, options);
  }



  crearGasto(s_token: string, formData: FormData) {
    // Headers opcionales, Authorization si hay token
    let headers = new HttpHeaders();
    if (s_token) {
      headers = headers.set('Authorization', `Bearer ${s_token}`);
    }

    const url = conexion.url + 'gastos/crear-gasto';

    // POST enviando FormData
    return this.http.post(url, formData, { headers });
  }



  getCategoriasGastos(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    let options = { headers: headers };

    let url = conexion.url + 'gastos/categorias';
    return this.http.get(url, options);
  }


  getTiposGastos(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let options = { headers: headers };

    let url = conexion.url + 'gastos/tipos';
    return this.http.get(url, options);
  }


  
}
