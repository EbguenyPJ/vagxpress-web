import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';
import { Observable } from 'rxjs';

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

  getRefaccionById(s_token: string, id_refaccion: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: s_token,
    });
    let params = { headers: headers };
    let url = `${conexion.url}mostrar-refaccion-id/${id_refaccion}`;
    return this.http.get(url, params);
  }

  crearRefaccion(s_token: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: s_token,
    });
    let url = conexion.url + 'crear-refaccion';
    return this.http.post(url, data, { headers: headers });
  }

  getMarcas(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: s_token,
    });
    return this.http.get(conexion.url + 'mostrar-marcas-refacciones', {
      headers: headers,
    });
  }

  getCategorias(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: s_token,
    });
    return this.http.get(conexion.url + 'mostrar-categorias-refacciones', {
      headers: headers,
    });
  }

  getSubcategorias(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: s_token,
    });
    return this.http.get(conexion.url + 'mostrar-subcategorias-refacciones', {
      headers: headers,
    });
  }

  editarRefaccion(s_token: string, id_refaccion: number, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: s_token,
    });
    let url = `${conexion.url}editar-refaccion/${id_refaccion}`;
    return this.http.put(url, data, { headers: headers });
  }

  getClases(s_token: string) {
    const headers = new HttpHeaders({ Authorization: s_token });
    return this.http.get(conexion.url + 'mostrar-clases-refacciones', {
      headers,
    });
  }

  getUnidadesMedida(s_token: string) {
    const headers = new HttpHeaders({ Authorization: s_token });
    return this.http.get(conexion.url + 'mostrar-unidades-medida', { headers });
  }

  getPosicionesVehiculo(s_token: string) {
    const headers = new HttpHeaders({ Authorization: s_token });
    return this.http.get(conexion.url + 'mostrar-posiciones-vehiculo', {
      headers,
    });
  }

  getUbicacionesAlmacen(s_token: string) {
    const headers = new HttpHeaders({ Authorization: s_token });
    return this.http.get(conexion.url + 'mostrar-ubicaciones-almacen', {
      headers,
    });
  }

  getProveedores(s_token: string) {
    const headers = new HttpHeaders({ Authorization: s_token });
    return this.http.get(conexion.url + 'mostrar-proveedores', { headers });
  }

  crearRefaccionesMasivo(s_token: string, data: { refacciones: any[] }) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: s_token,
    });

    let url = conexion.url + 'crear-refacciones-masivo';
    return this.http.post(url, data, { headers: headers });
  }
}
