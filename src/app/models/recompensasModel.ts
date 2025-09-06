import { formatDate } from '@angular/common';

export class RecompensasModel {
  id_recompensa: number;
  id_tipo_recompensa: number;
  s_recompensa: string;
  n_cantidad_puntos_lealtad: number;
  b_activo: number;
  s_tipo_recompensa?: string;

  constructor(recompensasModel: Partial<RecompensasModel> = {}) {
    this.id_recompensa = recompensasModel.id_recompensa || this.getRandomID();
    this.id_tipo_recompensa = recompensasModel.id_tipo_recompensa || 0;
    this.s_recompensa = recompensasModel.s_recompensa || '';
    this.n_cantidad_puntos_lealtad = recompensasModel.n_cantidad_puntos_lealtad || 0;
    this.b_activo = recompensasModel.b_activo !== undefined ? recompensasModel.b_activo : 1;
    this.s_tipo_recompensa = recompensasModel.s_tipo_recompensa || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}