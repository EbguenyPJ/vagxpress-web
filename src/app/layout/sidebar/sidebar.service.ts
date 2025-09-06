import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouteInfo } from './sidebar.metadata';
import { conexion } from 'app/conexion';

@Injectable({
  providedIn: 'root',
})

export class SidebarService {
  constructor(private http: HttpClient) {}

  /**
   * Get sidebar menu items from JSON file
   * @returns Observable<RouteInfo[]>
   */
  // getRouteInfo(): Observable<RouteInfo[]> {
  //   // Assuming the JSON file is in the assets folder
  //   return this.http
  //     .get<{ routes: RouteInfo[] }>('assets/data/routes.json')
  //     .pipe(map((response) => response.routes));
  // }



  // getRouteInfo(): Observable<RouteInfo[]>
  // {
  //   let url = conexion.url;

  //   //let headers = new HttpHeaders().set('Content-Type', 'application/json');

  //   return this.http
  //     .get<{ routes: RouteInfo[] }>(url +  'modulos-usuario/1')
  //     .pipe(map((response) => response.routes));
  // }


  getUserModules(s_token:string, id_usuario: number)
  {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Token': s_token
     });
    let params = { headers: headers };
    let url = conexion.url + 'modulos-usuario/'+id_usuario;
    return this.http.get(url, params);
  }


  getCategoriasModulos(s_token:string)
  {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Token': s_token
     });
    let params = { headers: headers };
    let url = conexion.url + 'categorias-modulos';
    return this.http.get(url, params);
  }


}
