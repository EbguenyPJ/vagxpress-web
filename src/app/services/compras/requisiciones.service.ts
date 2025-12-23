import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { conexion } from '../../conexion';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequisicionesService {

  // Flag para usar datos hardcodeados (modo demo)
  private usarDatosHardcodeados = true;

  constructor(private http: HttpClient) { }

  private getRequisicionesHardcoded() {
    return [
      {
        id_requisicion: 101,
        s_observacion: 'Requisición general de refacciones para inventario',
        n_cantidad_refacciones: 8,
        n_total_estimado: 53800.00,
        d_fecha_limite: '2024-02-01',
        d_fecha_solicitud: '2024-01-15',
        id_estatus_requisicion: 1,
        s_estatus_requisicion: 'Abierta',
        id_tipo_requisicion: 1,
        s_tipo_requisicion: 'General',
        id_usuario_crea: 1,
        b_activo: 1
      },
      {
        id_requisicion: 102,
        s_observacion: 'Pedido especial para temporada alta',
        n_cantidad_refacciones: 5,
        n_total_estimado: 42700.00,
        d_fecha_limite: '2024-02-10',
        d_fecha_solicitud: '2024-01-18',
        id_estatus_requisicion: 2,
        s_estatus_requisicion: 'Cerrada',
        id_tipo_requisicion: 2,
        s_tipo_requisicion: 'Especial',
        id_usuario_crea: 1,
        b_activo: 1
      },
      {
        id_requisicion: 103,
        s_observacion: 'Refacciones para reparaciones mayores',
        n_cantidad_refacciones: 6,
        n_total_estimado: 62900.00,
        d_fecha_limite: '2024-02-15',
        d_fecha_solicitud: '2024-01-20',
        id_estatus_requisicion: 2,
        s_estatus_requisicion: 'Cerrada',
        id_tipo_requisicion: 1,
        s_tipo_requisicion: 'General',
        id_usuario_crea: 1,
        b_activo: 1
      }
    ];
  }

  private getDetalleRequisicionHardcoded(id_requisicion: number) {
    const detalles: { [key: number]: any[] } = {
      101: [
        {
          id_requisicion_refaccion: 1,
          id_requisicion: 101,
          id_refaccion: 101,
          s_numero_parte: 'BRK-001',
          s_nombre_refaccion: 'Balata delantera cerámica',
          n_stock_actual: 5,
          n_cantidad_sugerida: 20,
          n_cantidad_solicitada: 20,
          n_costo_unitario: 350.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 2,
          s_prioridad: 'Alta',
          id_proveedor: 1,
          s_nombre_proveedor: 'Refacciones Automotrices del Norte SA de CV',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 2,
          id_requisicion: 101,
          id_refaccion: 102,
          s_numero_parte: 'DSC-500',
          s_nombre_refaccion: 'Disco de freno ventilado',
          n_stock_actual: 3,
          n_cantidad_sugerida: 15,
          n_cantidad_solicitada: 15,
          n_costo_unitario: 650.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 2,
          s_prioridad: 'Alta',
          id_proveedor: 1,
          s_nombre_proveedor: 'Refacciones Automotrices del Norte SA de CV',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 3,
          id_requisicion: 101,
          id_refaccion: 103,
          s_numero_parte: 'AMT-250',
          s_nombre_refaccion: 'Amortiguador delantero gas',
          n_stock_actual: 8,
          n_cantidad_sugerida: 10,
          n_cantidad_solicitada: 10,
          n_costo_unitario: 850.00,
          id_motivo_pedido: 2,
          s_motivo_pedido: 'Reposición',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 1,
          s_nombre_proveedor: 'Refacciones Automotrices del Norte SA de CV',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 4,
          id_requisicion: 101,
          id_refaccion: 201,
          s_numero_parte: 'FLT-AC-001',
          s_nombre_refaccion: 'Filtro de aceite sintético',
          n_stock_actual: 12,
          n_cantidad_sugerida: 50,
          n_cantidad_solicitada: 50,
          n_costo_unitario: 85.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 2,
          s_nombre_proveedor: 'Distribuidora de Autopartes del Bajío',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 5,
          id_requisicion: 101,
          id_refaccion: 202,
          s_numero_parte: 'FLT-AIR-002',
          s_nombre_refaccion: 'Filtro de aire alto rendimiento',
          n_stock_actual: 8,
          n_cantidad_sugerida: 40,
          n_cantidad_solicitada: 40,
          n_costo_unitario: 120.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 2,
          s_nombre_proveedor: 'Distribuidora de Autopartes del Bajío',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 6,
          id_requisicion: 101,
          id_refaccion: 301,
          s_numero_parte: 'BAT-12V-750',
          s_nombre_refaccion: 'Batería 12V 750A libre mantenimiento',
          n_stock_actual: 2,
          n_cantidad_sugerida: 8,
          n_cantidad_solicitada: 8,
          n_costo_unitario: 1850.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 2,
          s_prioridad: 'Alta',
          id_proveedor: 3,
          s_nombre_proveedor: 'Electroauto Componentes SA',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 7,
          id_requisicion: 101,
          id_refaccion: 302,
          s_numero_parte: 'ALT-150A',
          s_nombre_refaccion: 'Alternador 150 amperes',
          n_stock_actual: 1,
          n_cantidad_sugerida: 5,
          n_cantidad_solicitada: 5,
          n_costo_unitario: 2800.00,
          id_motivo_pedido: 2,
          s_motivo_pedido: 'Reposición',
          id_prioridad: 2,
          s_prioridad: 'Alta',
          id_proveedor: 3,
          s_nombre_proveedor: 'Electroauto Componentes SA',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 8,
          id_requisicion: 101,
          id_refaccion: 401,
          s_numero_parte: 'BOM-HID-001',
          s_nombre_refaccion: 'Bomba de frenos hidráulica',
          n_stock_actual: 0,
          n_cantidad_sugerida: 6,
          n_cantidad_solicitada: 6,
          n_costo_unitario: 1200.00,
          id_motivo_pedido: 2,
          s_motivo_pedido: 'Reposición',
          id_prioridad: 3,
          s_prioridad: 'Urgente',
          id_proveedor: 4,
          s_nombre_proveedor: 'Frenos y Suspensiones Industriales',
          b_activo: 1
        }
      ],
      102: [
        {
          id_requisicion_refaccion: 9,
          id_requisicion: 102,
          id_refaccion: 501,
          s_numero_parte: 'LLT-205-55-R16',
          s_nombre_refaccion: 'Llanta radial 205/55 R16',
          n_stock_actual: 4,
          n_cantidad_sugerida: 16,
          n_cantidad_solicitada: 16,
          n_costo_unitario: 1250.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 5,
          s_nombre_proveedor: 'Neumáticos y Accesorios del Centro',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 10,
          id_requisicion: 102,
          id_refaccion: 502,
          s_numero_parte: 'RIN-ALU-16',
          s_nombre_refaccion: 'Rin de aluminio 16 pulgadas',
          n_stock_actual: 2,
          n_cantidad_sugerida: 4,
          n_cantidad_solicitada: 4,
          n_costo_unitario: 850.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 5,
          s_nombre_proveedor: 'Neumáticos y Accesorios del Centro',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 11,
          id_requisicion: 102,
          id_refaccion: 301,
          s_numero_parte: 'BAT-12V-750',
          s_nombre_refaccion: 'Batería 12V 750A libre mantenimiento',
          n_stock_actual: 3,
          n_cantidad_sugerida: 5,
          n_cantidad_solicitada: 5,
          n_costo_unitario: 1900.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 2,
          s_prioridad: 'Alta',
          id_proveedor: 3,
          s_nombre_proveedor: 'Electroauto Componentes SA',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 12,
          id_requisicion: 102,
          id_refaccion: 701,
          s_numero_parte: 'JGO-BUJ-001',
          s_nombre_refaccion: 'Juego de bujías iridio',
          n_stock_actual: 10,
          n_cantidad_sugerida: 30,
          n_cantidad_solicitada: 30,
          n_costo_unitario: 280.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 1,
          s_nombre_proveedor: 'Refacciones Automotrices del Norte SA de CV',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 13,
          id_requisicion: 102,
          id_refaccion: 702,
          s_numero_parte: 'BAN-SER-001',
          s_nombre_refaccion: 'Banda serpentina reforzada',
          n_stock_actual: 6,
          n_cantidad_sugerida: 20,
          n_cantidad_solicitada: 20,
          n_costo_unitario: 320.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 1,
          s_nombre_proveedor: 'Refacciones Automotrices del Norte SA de CV',
          b_activo: 1
        }
      ],
      103: [
        {
          id_requisicion_refaccion: 14,
          id_requisicion: 103,
          id_refaccion: 801,
          s_numero_parte: 'MOT-4CIL-2.0',
          s_nombre_refaccion: 'Motor reconstruido 4 cilindros 2.0L',
          n_stock_actual: 0,
          n_cantidad_sugerida: 2,
          n_cantidad_solicitada: 2,
          n_costo_unitario: 15000.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 3,
          s_prioridad: 'Urgente',
          id_proveedor: 6,
          s_nombre_proveedor: 'Motores Reconstruidos del Pacífico',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 15,
          id_requisicion: 103,
          id_refaccion: 802,
          s_numero_parte: 'TRA-AUT-6V',
          s_nombre_refaccion: 'Transmisión automática 6 velocidades',
          n_stock_actual: 0,
          n_cantidad_sugerida: 1,
          n_cantidad_solicitada: 1,
          n_costo_unitario: 5000.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 3,
          s_prioridad: 'Urgente',
          id_proveedor: 6,
          s_nombre_proveedor: 'Motores Reconstruidos del Pacífico',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 16,
          id_requisicion: 103,
          id_refaccion: 901,
          s_numero_parte: 'ESC-COMP-001',
          s_nombre_refaccion: 'Escape completo acero inoxidable',
          n_stock_actual: 1,
          n_cantidad_sugerida: 3,
          n_cantidad_solicitada: 3,
          n_costo_unitario: 2600.00,
          id_motivo_pedido: 2,
          s_motivo_pedido: 'Reposición',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 7,
          s_nombre_proveedor: 'Escapes y Silenciadores Nacionales',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 17,
          id_requisicion: 103,
          id_refaccion: 1001,
          s_numero_parte: 'SAL-DEL-001',
          s_nombre_refaccion: 'Salpicadera delantera izquierda',
          n_stock_actual: 0,
          n_cantidad_sugerida: 2,
          n_cantidad_solicitada: 2,
          n_costo_unitario: 3500.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 2,
          s_prioridad: 'Alta',
          id_proveedor: 8,
          s_nombre_proveedor: 'Lamina y Pintura Automotriz',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 18,
          id_requisicion: 103,
          id_refaccion: 1002,
          s_numero_parte: 'PIN-AUTO-001',
          s_nombre_refaccion: 'Pintura automotriz (galón)',
          n_stock_actual: 5,
          n_cantidad_sugerida: 10,
          n_cantidad_solicitada: 10,
          n_costo_unitario: 750.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 8,
          s_nombre_proveedor: 'Lamina y Pintura Automotriz',
          b_activo: 1
        },
        {
          id_requisicion_refaccion: 19,
          id_requisicion: 103,
          id_refaccion: 203,
          s_numero_parte: 'ACE-5W30',
          s_nombre_refaccion: 'Aceite sintético 5W-30 (20L)',
          n_stock_actual: 8,
          n_cantidad_sugerida: 20,
          n_cantidad_solicitada: 20,
          n_costo_unitario: 850.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media',
          id_proveedor: 2,
          s_nombre_proveedor: 'Distribuidora de Autopartes del Bajío',
          b_activo: 1
        }
      ]
    };

    return detalles[id_requisicion] || [];
  }

  getRequisiciones(s_token: string): Observable<any> {
    if (this.usarDatosHardcodeados) {
      const requisiciones = this.getRequisicionesHardcoded();
      return of({
        status: 'success',
        message: 'Requisiciones obtenidas correctamente',
        data: requisiciones
      });
    } else {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': s_token
      });
      let params = { headers: headers };
      let url = conexion.url + 'mostrar-requisiciones';
      return this.http.get(url, params);
    }
  }

  getDetalleRequisicion(s_token: string, id_requisicion: number): Observable<any> {
    if (this.usarDatosHardcodeados) {
      const detalle = this.getDetalleRequisicionHardcoded(id_requisicion);
      return of({
        status: 'success',
        message: 'Detalle de requisición obtenido correctamente',
        data: [detalle]
      });
    } else {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': s_token
      });
      let params = { headers: headers };
      let url = conexion.url + 'mostrar-requisicion/' + id_requisicion;
      return this.http.get(url, params);
    }
  }

  cerrarRequisicion(s_token: string, id_requisicion: number): Observable<any> {
    // Simulación de cerrar requisición (cambiar estatus a 2)
    return of({
      status: 'success',
      message: 'Requisición cerrada correctamente',
      data: { id_requisicion, id_estatus_requisicion: 2 }
    });
  }

  actualizarRequisicion(s_token: string, id_requisicion: number, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'actualizar-requisicion/' + id_requisicion;
    let options = { headers: headers };
    return this.http.put(url, data, options);
  }

  getRequisicionPorProveedor(s_token: string, id_requisicion: number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let params = { headers: headers };
    let url = conexion.url + 'mostrar-requisicion-por-proveedor/' + id_requisicion;
    return this.http.get(url, params);
  }

  crearOrdenesCompras(s_token: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': s_token
    });
    let url = conexion.url + 'crear-ordenes-compras';
    let options = { headers: headers };
    return this.http.post(url, data, options);
  }
}
