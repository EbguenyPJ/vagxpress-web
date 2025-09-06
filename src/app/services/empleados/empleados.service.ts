import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private http: HttpClient) { }

  getEmpleados(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'listar-empleados';
    return this.http.get(url, { headers });
  }

  getEmpleadoPorUsuario(s_token: string, id_usuario: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'obtener-empleado-por-usuario/' + id_usuario;
    return this.http.get(url, { headers });
  }

  getEmpleadosSinUsuario(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'listar-empleados-sin-usuario';
    return this.http.get(url, { headers });
  }

  crearEmpleado(s_token: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'crear-empleado';
    return this.http.post(url, data, { headers });
  }

  actualizarEmpleado(s_token: string, id: number, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'actualizar-empleado/' + id;
    return this.http.put(url, data, { headers });
  }

  getHabilidadesEmpleado(s_token: string, id_empleado: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'habilidades-empleados/' + id_empleado;
    return this.http.get(url, { headers });
  }

  actualizarHabilidadesEmpleado(s_token: string, id_empleado: number, data: any[]) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'actualizar-habilidades-empleado/' + id_empleado;
    return this.http.put(url, data, { headers });
  }

  getGerenteBySucursal(s_token: string, id_sucursal: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'empleados-gerente/' + id_sucursal;
    return this.http.get(url, { headers });
  }

  getEmpleadosBySucursal(s_token: string, id_sucursal: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'empleados-sucursal/' + id_sucursal;
    return this.http.get(url, { headers });
  }
}
