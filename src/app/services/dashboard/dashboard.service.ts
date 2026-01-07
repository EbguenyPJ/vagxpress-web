import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { conexion } from '../../conexion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getVentasPagadasPorDia(s_token: string): Observable<[number, number][]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'ventas-pagadas-por-dia';
    return this.http.get<[number, number][]>(url, { headers });
  }

  getVentasHoy(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'ventas-hoy';

    return this.http.get<any>(url, { headers });
  }


  getOrdenesEnRepartoHoy(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'ordenes-en-reparto-hoy';

    return this.http.get<{ total_ordenes_reparto_hoy: number }>(url, { headers });
  }


  getOrdenesCompraHoy(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'ordenes-compra-hoy';

    return this.http.get<any>(url, { headers });
  }


  getRequisicionesAprobadasHoy(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'requisiciones-aprobadas-hoy';

    return this.http.get<any>(url, { headers });
  }


  getTop5ClientesConMasVentas(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'top5-clientes-con-mas-ventas';

    return this.http.get<any>(url, { headers });
  }


  getTop5Refacciones(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'top5-refacciones-vendidas';

    return this.http.get<any>(url, { headers });
  }


  getVentasAcumuladasHoy(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'total-ventas-hoy';

    return this.http.get<any>(url, { headers });
  }


  getVentasMetodosPagosHoy(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'ventas-metodos-hoy';

    return this.http.get<any>(url, { headers });
  }


  getRefaccionistaMasVentas(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'refaccionista-mas-ventas';

    return this.http.get<any>(url, { headers });
  }


  getRefaccionistaStockMinimo(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'refacciones-stock-minimo';

    return this.http.get<any>(url, { headers });
  }



  getProveedoresActivos(s_token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });

    const url = conexion.url + 'proveedores-mas-activos';

    return this.http.get<any>(url, { headers });
  }











}
