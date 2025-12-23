export class OrdenCompra {
  id_orden_compra: number;
  s_folio_interno: string;
  id_requisicion: number;
  id_proveedor: number;
  s_proveedor: string;
  d_fecha_orden: string;
  d_fecha_recepcion_estimada: string | null;
  n_total_estimado: number;
  id_estatus_orden_compra: number;
  s_estatus_orden_compra: string;

  constructor(orden: Partial<OrdenCompra> = {}) {
    this.id_orden_compra = orden.id_orden_compra || this.getRandomID();
    this.s_folio_interno = orden.s_folio_interno || '';
    this.id_requisicion = orden.id_requisicion || 0;
    this.id_proveedor = orden.id_proveedor || 0;
    this.s_proveedor = orden.s_proveedor || '';
    this.d_fecha_orden = orden.d_fecha_orden || '';
    this.d_fecha_recepcion_estimada = orden.d_fecha_recepcion_estimada || null;
    this.n_total_estimado = orden.n_total_estimado ? parseFloat(orden.n_total_estimado.toString()) : 0;
    this.id_estatus_orden_compra = orden.id_estatus_orden_compra || 0;
    this.s_estatus_orden_compra = orden.s_estatus_orden_compra || '';
  }

  public getRandomID(): number {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return Number(S4() + S4());
  }
}
