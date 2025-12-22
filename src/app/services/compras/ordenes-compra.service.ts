import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { OrdenCompra, OrdenCompraDetalle } from 'app/models/ordenCompraModel';

@Injectable({
  providedIn: 'root'
})
export class OrdenesCompraService {

  constructor(private http: HttpClient) { }

  // Datos hardcodeados para la demo
  private getOrdenesCompraHardcoded(): OrdenCompra[] {
    return [
      // Requisición 1 - 4 proveedores
      new OrdenCompra({
        id_orden_compra: 1,
        s_folio_interno: 'OC-2024-001',
        s_observacion: 'Orden de compra para refacciones urgentes',
        d_fecha_orden: '2024-01-15',
        d_fecha_recepcion_estimada: '2024-01-25',
        n_total_estimado: 15000.00,
        id_proveedor: 1,
        s_nombre_proveedor: 'Refacciones Automotrices del Norte SA de CV',
        id_requisicion: 101,
        id_estatus_orden_compra: 1,
        s_estatus_orden_compra: 'Pendiente',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: null,
        b_activo: 1
      }),
      new OrdenCompra({
        id_orden_compra: 2,
        s_folio_interno: 'OC-2024-002',
        s_observacion: 'Pedido de filtros y aceites',
        d_fecha_orden: '2024-01-15',
        d_fecha_recepcion_estimada: '2024-01-22',
        n_total_estimado: 8500.00,
        id_proveedor: 2,
        s_nombre_proveedor: 'Distribuidora de Autopartes del Bajío',
        id_requisicion: 101,
        id_estatus_orden_compra: 1,
        s_estatus_orden_compra: 'Pendiente',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: null,
        b_activo: 1
      }),
      new OrdenCompra({
        id_orden_compra: 3,
        s_folio_interno: 'OC-2024-003',
        s_observacion: 'Partes eléctricas',
        d_fecha_orden: '2024-01-15',
        d_fecha_recepcion_estimada: '2024-01-28',
        n_total_estimado: 12300.00,
        id_proveedor: 3,
        s_nombre_proveedor: 'Electroauto Componentes SA',
        id_requisicion: 101,
        id_estatus_orden_compra: 2,
        s_estatus_orden_compra: 'Autorizada',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: 2,
        b_activo: 1
      }),
      new OrdenCompra({
        id_orden_compra: 4,
        s_folio_interno: 'OC-2024-004',
        s_observacion: 'Sistema de frenos',
        d_fecha_orden: '2024-01-15',
        d_fecha_recepcion_estimada: '2024-01-30',
        n_total_estimado: 18000.00,
        id_proveedor: 4,
        s_nombre_proveedor: 'Frenos y Suspensiones Industriales',
        id_requisicion: 101,
        id_estatus_orden_compra: 1,
        s_estatus_orden_compra: 'Pendiente',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: null,
        b_activo: 1
      }),

      // Requisición 2 - 3 proveedores
      new OrdenCompra({
        id_orden_compra: 5,
        s_folio_interno: 'OC-2024-005',
        s_observacion: 'Llantas y rines',
        d_fecha_orden: '2024-01-18',
        d_fecha_recepcion_estimada: '2024-02-01',
        n_total_estimado: 22000.00,
        id_proveedor: 5,
        s_nombre_proveedor: 'Neumáticos y Accesorios del Centro',
        id_requisicion: 102,
        id_estatus_orden_compra: 2,
        s_estatus_orden_compra: 'Autorizada',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: 2,
        b_activo: 1
      }),
      new OrdenCompra({
        id_orden_compra: 6,
        s_folio_interno: 'OC-2024-006',
        s_observacion: 'Batería y alternadores',
        d_fecha_orden: '2024-01-18',
        d_fecha_recepcion_estimada: '2024-01-29',
        n_total_estimado: 9500.00,
        id_proveedor: 3,
        s_nombre_proveedor: 'Electroauto Componentes SA',
        id_requisicion: 102,
        id_estatus_orden_compra: 1,
        s_estatus_orden_compra: 'Pendiente',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: null,
        b_activo: 1
      }),
      new OrdenCompra({
        id_orden_compra: 7,
        s_folio_interno: 'OC-2024-007',
        s_observacion: 'Refacciones varias',
        d_fecha_orden: '2024-01-18',
        d_fecha_recepcion_estimada: '2024-02-05',
        n_total_estimado: 11200.00,
        id_proveedor: 1,
        s_nombre_proveedor: 'Refacciones Automotrices del Norte SA de CV',
        id_requisicion: 102,
        id_estatus_orden_compra: 1,
        s_estatus_orden_compra: 'Pendiente',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: null,
        b_activo: 1
      }),

      // Requisición 3 - 4 proveedores
      new OrdenCompra({
        id_orden_compra: 8,
        s_folio_interno: 'OC-2024-008',
        s_observacion: 'Motor y transmisión',
        d_fecha_orden: '2024-01-20',
        d_fecha_recepcion_estimada: '2024-02-10',
        n_total_estimado: 35000.00,
        id_proveedor: 6,
        s_nombre_proveedor: 'Motores Reconstruidos del Pacífico',
        id_requisicion: 103,
        id_estatus_orden_compra: 3,
        s_estatus_orden_compra: 'En tránsito',
        id_usuario_crea: 1,
        id_usuario_modifica: 1,
        id_usuario_autoriza: 2,
        b_activo: 1
      }),
      new OrdenCompra({
        id_orden_compra: 9,
        s_folio_interno: 'OC-2024-009',
        s_observacion: 'Sistema de escape',
        d_fecha_orden: '2024-01-20',
        d_fecha_recepcion_estimada: '2024-02-03',
        n_total_estimado: 7800.00,
        id_proveedor: 7,
        s_nombre_proveedor: 'Escapes y Silenciadores Nacionales',
        id_requisicion: 103,
        id_estatus_orden_compra: 2,
        s_estatus_orden_compra: 'Autorizada',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: 2,
        b_activo: 1
      }),
      new OrdenCompra({
        id_orden_compra: 10,
        s_folio_interno: 'OC-2024-010',
        s_observacion: 'Carrocería y pintura',
        d_fecha_orden: '2024-01-20',
        d_fecha_recepcion_estimada: '2024-02-08',
        n_total_estimado: 14500.00,
        id_proveedor: 8,
        s_nombre_proveedor: 'Lamina y Pintura Automotriz',
        id_requisicion: 103,
        id_estatus_orden_compra: 1,
        s_estatus_orden_compra: 'Pendiente',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: null,
        b_activo: 1
      }),
      new OrdenCompra({
        id_orden_compra: 11,
        s_folio_interno: 'OC-2024-011',
        s_observacion: 'Lubricantes y líquidos',
        d_fecha_orden: '2024-01-20',
        d_fecha_recepcion_estimada: '2024-01-27',
        n_total_estimado: 5600.00,
        id_proveedor: 2,
        s_nombre_proveedor: 'Distribuidora de Autopartes del Bajío',
        id_requisicion: 103,
        id_estatus_orden_compra: 2,
        s_estatus_orden_compra: 'Autorizada',
        id_usuario_crea: 1,
        id_usuario_modifica: null,
        id_usuario_autoriza: 2,
        b_activo: 1
      }),
    ];
  }

  private getDetalleOrdenCompraHardcoded(id_orden_compra: number): OrdenCompraDetalle[] {
    const detalles: { [key: number]: OrdenCompraDetalle[] } = {
      1: [
        {
          id_orden_compra_requisicion_refaccion: 1,
          id_orden_compra: 1,
          id_requisicion_refaccion: 1,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 101,
          s_numero_parte: 'BRK-001',
          s_nombre_refaccion: 'Balata delantera cerámica',
          n_cantidad_sugerida: 20,
          n_cantidad_solicitada: 20,
          n_costo_unitario: 350.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 2,
          s_prioridad: 'Alta'
        },
        {
          id_orden_compra_requisicion_refaccion: 2,
          id_orden_compra: 1,
          id_requisicion_refaccion: 2,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 102,
          s_numero_parte: 'DSC-500',
          s_nombre_refaccion: 'Disco de freno ventilado',
          n_cantidad_sugerida: 15,
          n_cantidad_solicitada: 15,
          n_costo_unitario: 650.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 2,
          s_prioridad: 'Alta'
        },
        {
          id_orden_compra_requisicion_refaccion: 3,
          id_orden_compra: 1,
          id_requisicion_refaccion: 3,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 103,
          s_numero_parte: 'AMT-250',
          s_nombre_refaccion: 'Amortiguador delantero gas',
          n_cantidad_sugerida: 10,
          n_cantidad_solicitada: 10,
          n_costo_unitario: 850.00,
          id_motivo_pedido: 2,
          s_motivo_pedido: 'Reposición',
          id_prioridad: 1,
          s_prioridad: 'Media'
        }
      ],
      2: [
        {
          id_orden_compra_requisicion_refaccion: 4,
          id_orden_compra: 2,
          id_requisicion_refaccion: 4,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 201,
          s_numero_parte: 'FLT-AC-001',
          s_nombre_refaccion: 'Filtro de aceite sintético',
          n_cantidad_sugerida: 50,
          n_cantidad_solicitada: 50,
          n_costo_unitario: 85.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media'
        },
        {
          id_orden_compra_requisicion_refaccion: 5,
          id_orden_compra: 2,
          id_requisicion_refaccion: 5,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 202,
          s_numero_parte: 'FLT-AIR-002',
          s_nombre_refaccion: 'Filtro de aire alto rendimiento',
          n_cantidad_sugerida: 40,
          n_cantidad_solicitada: 40,
          n_costo_unitario: 120.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media'
        },
        {
          id_orden_compra_requisicion_refaccion: 6,
          id_orden_compra: 2,
          id_requisicion_refaccion: 6,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 203,
          s_numero_parte: 'ACE-5W30',
          s_nombre_refaccion: 'Aceite sintético 5W-30 (20L)',
          n_cantidad_sugerida: 25,
          n_cantidad_solicitada: 25,
          n_costo_unitario: 850.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 2,
          s_prioridad: 'Alta'
        }
      ],
      3: [
        {
          id_orden_compra_requisicion_refaccion: 7,
          id_orden_compra: 3,
          id_requisicion_refaccion: 7,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 301,
          s_numero_parte: 'BAT-12V-750',
          s_nombre_refaccion: 'Batería 12V 750A libre mantenimiento',
          n_cantidad_sugerida: 8,
          n_cantidad_solicitada: 8,
          n_costo_unitario: 1850.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 2,
          s_prioridad: 'Alta'
        },
        {
          id_orden_compra_requisicion_refaccion: 8,
          id_orden_compra: 3,
          id_requisicion_refaccion: 8,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 302,
          s_numero_parte: 'ALT-150A',
          s_nombre_refaccion: 'Alternador 150 amperes',
          n_cantidad_sugerida: 5,
          n_cantidad_solicitada: 5,
          n_costo_unitario: 2800.00,
          id_motivo_pedido: 2,
          s_motivo_pedido: 'Reposición',
          id_prioridad: 2,
          s_prioridad: 'Alta'
        }
      ],
      4: [
        {
          id_orden_compra_requisicion_refaccion: 9,
          id_orden_compra: 4,
          id_requisicion_refaccion: 9,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 401,
          s_numero_parte: 'BOM-HID-001',
          s_nombre_refaccion: 'Bomba de frenos hidráulica',
          n_cantidad_sugerida: 6,
          n_cantidad_solicitada: 6,
          n_costo_unitario: 1200.00,
          id_motivo_pedido: 2,
          s_motivo_pedido: 'Reposición',
          id_prioridad: 3,
          s_prioridad: 'Urgente'
        },
        {
          id_orden_compra_requisicion_refaccion: 10,
          id_orden_compra: 4,
          id_requisicion_refaccion: 10,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 402,
          s_numero_parte: 'CAL-FRN-002',
          s_nombre_refaccion: 'Caliper flotante delantero',
          n_cantidad_sugerida: 10,
          n_cantidad_solicitada: 10,
          n_costo_unitario: 1200.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 2,
          s_prioridad: 'Alta'
        }
      ],
      5: [
        {
          id_orden_compra_requisicion_refaccion: 11,
          id_orden_compra: 5,
          id_requisicion_refaccion: 11,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 501,
          s_numero_parte: 'LLT-205-55-R16',
          s_nombre_refaccion: 'Llanta radial 205/55 R16',
          n_cantidad_sugerida: 16,
          n_cantidad_solicitada: 16,
          n_costo_unitario: 1250.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media'
        },
        {
          id_orden_compra_requisicion_refaccion: 12,
          id_orden_compra: 5,
          id_requisicion_refaccion: 12,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 502,
          s_numero_parte: 'RIN-ALU-16',
          s_nombre_refaccion: 'Rin de aluminio 16 pulgadas',
          n_cantidad_sugerida: 4,
          n_cantidad_solicitada: 4,
          n_costo_unitario: 850.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 1,
          s_prioridad: 'Media'
        }
      ],
      6: [
        {
          id_orden_compra_requisicion_refaccion: 13,
          id_orden_compra: 6,
          id_requisicion_refaccion: 13,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 301,
          s_numero_parte: 'BAT-12V-750',
          s_nombre_refaccion: 'Batería 12V 750A libre mantenimiento',
          n_cantidad_sugerida: 5,
          n_cantidad_solicitada: 5,
          n_costo_unitario: 1900.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 2,
          s_prioridad: 'Alta'
        }
      ],
      7: [
        {
          id_orden_compra_requisicion_refaccion: 14,
          id_orden_compra: 7,
          id_requisicion_refaccion: 14,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 701,
          s_numero_parte: 'JGO-BUJ-001',
          s_nombre_refaccion: 'Juego de bujías iridio',
          n_cantidad_sugerida: 30,
          n_cantidad_solicitada: 30,
          n_costo_unitario: 280.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media'
        },
        {
          id_orden_compra_requisicion_refaccion: 15,
          id_orden_compra: 7,
          id_requisicion_refaccion: 15,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 702,
          s_numero_parte: 'BAN-SER-001',
          s_nombre_refaccion: 'Banda serpentina reforzada',
          n_cantidad_sugerida: 20,
          n_cantidad_solicitada: 20,
          n_costo_unitario: 320.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media'
        }
      ],
      8: [
        {
          id_orden_compra_requisicion_refaccion: 16,
          id_orden_compra: 8,
          id_requisicion_refaccion: 16,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 801,
          s_numero_parte: 'MOT-4CIL-2.0',
          s_nombre_refaccion: 'Motor reconstruido 4 cilindros 2.0L',
          n_cantidad_sugerida: 2,
          n_cantidad_solicitada: 2,
          n_costo_unitario: 15000.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 3,
          s_prioridad: 'Urgente'
        },
        {
          id_orden_compra_requisicion_refaccion: 17,
          id_orden_compra: 8,
          id_requisicion_refaccion: 17,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 802,
          s_numero_parte: 'TRA-AUT-6V',
          s_nombre_refaccion: 'Transmisión automática 6 velocidades',
          n_cantidad_sugerida: 1,
          n_cantidad_solicitada: 1,
          n_costo_unitario: 5000.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 3,
          s_prioridad: 'Urgente'
        }
      ],
      9: [
        {
          id_orden_compra_requisicion_refaccion: 18,
          id_orden_compra: 9,
          id_requisicion_refaccion: 18,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 901,
          s_numero_parte: 'ESC-COMP-001',
          s_nombre_refaccion: 'Escape completo acero inoxidable',
          n_cantidad_sugerida: 3,
          n_cantidad_solicitada: 3,
          n_costo_unitario: 2600.00,
          id_motivo_pedido: 2,
          s_motivo_pedido: 'Reposición',
          id_prioridad: 1,
          s_prioridad: 'Media'
        }
      ],
      10: [
        {
          id_orden_compra_requisicion_refaccion: 19,
          id_orden_compra: 10,
          id_requisicion_refaccion: 19,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 1001,
          s_numero_parte: 'SAL-DEL-001',
          s_nombre_refaccion: 'Salpicadera delantera izquierda',
          n_cantidad_sugerida: 2,
          n_cantidad_solicitada: 2,
          n_costo_unitario: 3500.00,
          id_motivo_pedido: 3,
          s_motivo_pedido: 'Pedido especial',
          id_prioridad: 2,
          s_prioridad: 'Alta'
        },
        {
          id_orden_compra_requisicion_refaccion: 20,
          id_orden_compra: 10,
          id_requisicion_refaccion: 20,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 1002,
          s_numero_parte: 'PIN-AUTO-001',
          s_nombre_refaccion: 'Pintura automotriz (galón)',
          n_cantidad_sugerida: 10,
          n_cantidad_solicitada: 10,
          n_costo_unitario: 750.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media'
        }
      ],
      11: [
        {
          id_orden_compra_requisicion_refaccion: 21,
          id_orden_compra: 11,
          id_requisicion_refaccion: 21,
          n_cantidad_recibida: 0,
          b_activo: 1,
          id_refaccion: 203,
          s_numero_parte: 'ACE-5W30',
          s_nombre_refaccion: 'Aceite sintético 5W-30 (20L)',
          n_cantidad_sugerida: 20,
          n_cantidad_solicitada: 20,
          n_costo_unitario: 850.00,
          id_motivo_pedido: 1,
          s_motivo_pedido: 'Stock bajo',
          id_prioridad: 1,
          s_prioridad: 'Media'
        }
      ]
    };

    return detalles[id_orden_compra] || [];
  }

  getOrdenesCompra(s_token: string): Observable<any> {
    // Simulación de respuesta del backend
    const ordenes = this.getOrdenesCompraHardcoded();

    return of({
      status: 'success',
      message: 'Órdenes de compra obtenidas correctamente',
      data: ordenes
    });
  }

  getDetalleOrdenCompra(s_token: string, id_orden_compra: number): Observable<any> {
    // Simulación de respuesta del backend con datos enriquecidos
    const detalle = this.getDetalleOrdenCompraHardcoded(id_orden_compra);

    return of({
      status: 'success',
      message: 'Detalle de orden de compra obtenido correctamente',
      data: [detalle]
    });
  }

  actualizarOrdenCompra(s_token: string, ordenCompra: any): Observable<any> {
    return of({
      status: 'success',
      message: 'Orden de compra actualizada correctamente',
      data: ordenCompra
    });
  }
}
