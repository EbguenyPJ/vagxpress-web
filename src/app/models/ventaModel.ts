export class Venta {
  id_venta: number;
  n_subtotal: number;
  n_total: number;
  n_cantidad_refacciones: number;

  constructor(venta: Partial<Venta> = {}) {
    this.id_venta = venta.id_venta || this.getRandomID();
    this.n_subtotal = venta.n_subtotal ? parseFloat(venta.n_subtotal.toString()) : 0;
    this.n_total = venta.n_total ? parseFloat(venta.n_total.toString()) : 0;
    this.n_cantidad_refacciones = venta.n_cantidad_refacciones ? parseInt(venta.n_cantidad_refacciones.toString()) : 0;
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
