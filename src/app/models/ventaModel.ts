export class Venta {
  id_venta: number;
  n_subtotal: number;
  n_porcentaje_iva: number;
  n_total: number;
  n_cantidad_refacciones: number;
  id_estatus_venta: number;
  s_estatus_venta: string;
  id_metodo_pago: number;
  s_metodo_pago: string;
  id_cliente: number;
  s_nombre_cliente: string;

  constructor(venta: Partial<Venta> = {}) {
    this.id_venta = venta.id_venta || this.getRandomID();
    this.n_subtotal = venta.n_subtotal ? parseFloat(venta.n_subtotal.toString()) : 0;
    this.n_porcentaje_iva = venta.n_porcentaje_iva ? parseFloat(venta.n_porcentaje_iva.toString()) : 0;
    this.n_total = venta.n_total ? parseFloat(venta.n_total.toString()) : 0;
    this.n_cantidad_refacciones = venta.n_cantidad_refacciones ? parseInt(venta.n_cantidad_refacciones.toString()) : 0;
    this.id_estatus_venta = venta.id_estatus_venta || 0;
    this.s_estatus_venta = venta.s_estatus_venta || '';
    this.id_metodo_pago = venta.id_metodo_pago || 0;
    this.s_metodo_pago = venta.s_metodo_pago || '';
    this.id_cliente = venta.id_cliente || 0;
    this.s_nombre_cliente = venta.s_nombre_cliente || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
