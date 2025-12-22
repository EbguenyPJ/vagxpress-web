export class OrdenCompra {
  id_orden_compra: number;
  s_folio_interno: string;
  s_observacion: string;
  d_fecha_orden: string;
  d_fecha_recepcion_estimada: string;
  n_total_estimado: number;
  id_proveedor: number;
  s_nombre_proveedor: string;
  id_requisicion: number;
  id_estatus_orden_compra: number;
  s_estatus_orden_compra: string;
  id_usuario_crea: number;
  id_usuario_modifica: number | null;
  id_usuario_autoriza: number | null;
  b_activo: number;

  constructor(ordenCompra: Partial<OrdenCompra> = {}) {
    this.id_orden_compra = ordenCompra.id_orden_compra || this.getRandomID();
    this.s_folio_interno = ordenCompra.s_folio_interno || '';
    this.s_observacion = ordenCompra.s_observacion || '';
    this.d_fecha_orden = ordenCompra.d_fecha_orden || '';
    this.d_fecha_recepcion_estimada = ordenCompra.d_fecha_recepcion_estimada || '';
    this.n_total_estimado = ordenCompra.n_total_estimado ? parseFloat(ordenCompra.n_total_estimado.toString()) : 0;
    this.id_proveedor = ordenCompra.id_proveedor || 0;
    this.s_nombre_proveedor = ordenCompra.s_nombre_proveedor || '';
    this.id_requisicion = ordenCompra.id_requisicion || 0;
    this.id_estatus_orden_compra = ordenCompra.id_estatus_orden_compra || 0;
    this.s_estatus_orden_compra = ordenCompra.s_estatus_orden_compra || '';
    this.id_usuario_crea = ordenCompra.id_usuario_crea || 0;
    this.id_usuario_modifica = ordenCompra.id_usuario_modifica || null;
    this.id_usuario_autoriza = ordenCompra.id_usuario_autoriza || null;
    this.b_activo = ordenCompra.b_activo || 1;
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}

export interface OrdenCompraDetalle {
  id_orden_compra_requisicion_refaccion: number;
  id_orden_compra: number;
  id_requisicion_refaccion: number;
  n_cantidad_recibida: number;
  b_activo: number;

  // Campos enriquecidos del join
  id_refaccion?: number;
  s_numero_parte?: string;
  s_nombre_refaccion?: string;
  n_cantidad_sugerida?: number;
  n_cantidad_solicitada?: number;
  n_costo_unitario?: number;
  id_motivo_pedido?: number;
  s_motivo_pedido?: string;
  id_prioridad?: number;
  s_prioridad?: string;
}
