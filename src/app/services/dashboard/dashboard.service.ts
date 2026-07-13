import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBase } from '../api-base';

/**
 * Indicadores del dashboard. Los shapes vienen sin envoltura,
 * exactamente como los consumen las gráficas.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService extends ApiBase {
  getVentasPagadasPorDia(): Observable<[number, number][]> {
    return this.http.get<[number, number][]>(`${this.apiUrl}/dashboard/ventas-pagadas-por-dia`);
  }

  getVentasHoy(): Observable<{ total_ventas_hoy: number }> {
    return this.http.get<{ total_ventas_hoy: number }>(`${this.apiUrl}/dashboard/ventas-hoy`);
  }

  getAcumuladoVentasHoy(): Observable<{ acumulado_ventas_hoy: number }> {
    return this.http.get<{ acumulado_ventas_hoy: number }>(`${this.apiUrl}/dashboard/total-ventas-hoy`);
  }

  getOrdenesEnRepartoHoy(): Observable<{ total_ordenes_reparto_hoy: number }> {
    return this.http.get<{ total_ordenes_reparto_hoy: number }>(`${this.apiUrl}/dashboard/ordenes-en-reparto-hoy`);
  }

  getOrdenesCompraHoy(): Observable<{ total_ordenes_compra_hoy: number }> {
    return this.http.get<{ total_ordenes_compra_hoy: number }>(`${this.apiUrl}/dashboard/ordenes-compra-hoy`);
  }

  getRequisicionesAprobadasHoy(): Observable<{ total_requisiciones_aprobadas_hoy: number }> {
    return this.http.get<{ total_requisiciones_aprobadas_hoy: number }>(`${this.apiUrl}/dashboard/requisiciones-aprobadas-hoy`);
  }

  getTop5Clientes(): Observable<{ id_cliente: number; s_nombre_cliente: string; total_ventas: number; monto_total: string | number }[]> {
    return this.http.get<{ id_cliente: number; s_nombre_cliente: string; total_ventas: number; monto_total: string | number }[]>(`${this.apiUrl}/dashboard/top5-clientes`);
  }

  getTop5RefaccionesVendidas(): Observable<{ top_mas: unknown[]; top_menos: unknown[] }> {
    return this.http.get<{ top_mas: unknown[]; top_menos: unknown[] }>(`${this.apiUrl}/dashboard/top5-refacciones-vendidas`);
  }

  getVentasMetodosPagosHoy(): Observable<{ ventas_por_metodo_pago_hoy: { id_metodo_pago: number; s_metodo_pago: string; total_ventas: number }[] }> {
    return this.http.get<{ ventas_por_metodo_pago_hoy: { id_metodo_pago: number; s_metodo_pago: string; total_ventas: number }[] }>(`${this.apiUrl}/dashboard/ventas-metodos-hoy`);
  }

  getTop5Refaccionistas(): Observable<{ top_5_refaccionistas_ingresos: unknown[] }> {
    return this.http.get<{ top_5_refaccionistas_ingresos: unknown[] }>(`${this.apiUrl}/dashboard/top5-refaccionistas`);
  }

  getRefaccionesCriticas(): Observable<{ top_5_refacciones_criticas: unknown[] }> {
    return this.http.get<{ top_5_refacciones_criticas: unknown[] }>(`${this.apiUrl}/dashboard/refacciones-criticas`);
  }

  getTopProveedores(): Observable<{ top_proveedores_refacciones: unknown[] }> {
    return this.http.get<{ top_proveedores_refacciones: unknown[] }>(`${this.apiUrl}/dashboard/top-proveedores`);
  }
}
