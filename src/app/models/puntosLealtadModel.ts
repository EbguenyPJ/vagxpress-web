import { formatDate } from '@angular/common';

export class PuntosLealtadModel {
  id_punto_lealtad: number;
  id_cliente: number;
  id_orden_servicio: number;
  id_forma_adquisicion: number;
  n_num_puntos: number;
  b_activo: number;
  s_forma_adquisicion?: string;
  seleccionado?: boolean;

  constructor(puntosLealtadModel: Partial<PuntosLealtadModel> = {}) {
    this.id_punto_lealtad = Number(puntosLealtadModel.id_punto_lealtad) || this.getRandomID();
    this.id_cliente = Number(puntosLealtadModel.id_cliente) || 0;
    this.id_orden_servicio = Number(puntosLealtadModel.id_orden_servicio) || 0;
    this.id_forma_adquisicion = Number(puntosLealtadModel.id_forma_adquisicion) || 0;
    this.n_num_puntos = Number(puntosLealtadModel.n_num_puntos) || 0;
    this.b_activo = puntosLealtadModel.b_activo !== undefined ? Number(puntosLealtadModel.b_activo) : 1;
    this.s_forma_adquisicion = puntosLealtadModel.s_forma_adquisicion || '';
    this.seleccionado = Boolean(puntosLealtadModel.seleccionado) || false;
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}