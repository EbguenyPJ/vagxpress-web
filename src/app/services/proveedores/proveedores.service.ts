import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private http: HttpClient) { }


    getProveedores(s_token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'proveedor/listar-proveedores';
    return this.http.get(url, { headers });
  }

    crearProveedor(s_token: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'proveedor/crear-proveedor';
    return this.http.post(url, data, { headers });
  }

  actualizarProveedor(s_token: string, id: number, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'proveedor/actualizar-proveedor/' + id;
    return this.http.put(url, data, { headers });
  }



}
