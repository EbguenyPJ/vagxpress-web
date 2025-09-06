import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(private http: HttpClient) { }


  getAlertas(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'alertas';
    return this.http.get(url, params);
  }

  // Método para alertas de componente (tipos 4-7)
  getAlertasComponente(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'alertas-componente';
    return this.http.get(url, params);
  }

  // Obtener tipos de alerta disponibles
  getTiposAlertaDisponibles(s_token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    const url = conexion.url + 'tipos-alerta';
    return this.http.get(url, { headers }).toPromise();
  }

  // Crear nueva alerta
  crearAlerta(s_token: string, datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    const url = conexion.url + 'alerta';
    return this.http.post(url, datos, { headers }).toPromise();
  }

  // Actualizar alerta
  actualizarAlerta(s_token: string, id: number, datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    const url = conexion.url + 'alerta/' + id;
    return this.http.put(url, datos, { headers }).toPromise();
  }

  // Desactivar alerta (lógica)
  desactivarAlerta(s_token: string, id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    const url = conexion.url + 'desactivar-alerta/' + id;
    return this.http.put(url, {}, { headers }).toPromise();
  }

}
