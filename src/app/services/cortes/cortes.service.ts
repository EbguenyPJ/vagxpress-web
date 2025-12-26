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
      url += '?fechaHora=' + encodeURIComponent(fechaHora);
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
      url += '?fechaHora=' + encodeURIComponent(fechaHora);
    }

    return this.http.get(url, { headers: headers });
  }


  crearCorte(s_token: string, data: any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    let url = conexion.url + 'crear-corte';

    return this.http.post(url, data, { headers });
  }



subirEvidenciasCorte(token: string, idCorte: number, evidencias: any[]) {
  const formData = new FormData();

  formData.append('id_corte', idCorte.toString());

  evidencias.forEach((ev, index) => {
    formData.append(`evidencias[${index}][archivo]`, ev.archivo);
    formData.append(`evidencias[${index}][id_metodo_pago]`, ev.id_metodo_pago);
    formData.append(`evidencias[${index}][id_tipo_evidencia]`, ev.id_tipo_evidencia);
    if (ev.s_descripcion) {
      formData.append(`evidencias[${index}][s_descripcion]`, ev.s_descripcion);
    }
  });

  const headers = new HttpHeaders({
    'Authorization': token
    // 🚨 NO Content-Type
  });

  const url = conexion.url + 'subir-evidencias-corte';

  return this.http.post(url, formData, { headers });
}

 getCortes(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-cortes'
    return this.http.get(url, params);
  }


getCorteById(s_token: string, id_corte: number): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': s_token
  });

  const url = conexion.url + 'mostrar-corte-id/' + id_corte;
  return this.http.get(url, { headers });
}


  



}
