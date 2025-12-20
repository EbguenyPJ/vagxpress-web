export class Requisicion {
  id_requisicion: number;
  n_cantidad_refacciones: number;
  n_total_estimado: number;
  id_estatus_requisicion: number;
  s_estatus_requisicion: string;
  id_tipo_requisicion: number;
  s_tipo_requisicion: string;

  constructor(requisicion: Partial<Requisicion> = {}) {
    this.id_requisicion = requisicion.id_requisicion || this.getRandomID();
    this.n_cantidad_refacciones = requisicion.n_cantidad_refacciones ? parseInt(requisicion.n_cantidad_refacciones.toString()) : 0;
    this.n_total_estimado = requisicion.n_total_estimado ? parseFloat(requisicion.n_total_estimado.toString()) : 0;
    this.id_estatus_requisicion = requisicion.id_estatus_requisicion || 0;
    this.s_estatus_requisicion = requisicion.s_estatus_requisicion || '';
    this.id_tipo_requisicion = requisicion.id_tipo_requisicion || 0;
    this.s_tipo_requisicion = requisicion.s_tipo_requisicion || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
