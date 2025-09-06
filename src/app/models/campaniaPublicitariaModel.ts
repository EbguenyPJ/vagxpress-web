import { formatDate } from '@angular/common';

export class campaniaPublicitariaModel {
  id_campania_publicitaria: number;
  id_origen_campania: number;
  id_estatus_campania: number;
  s_campania_publicitaria: string;
  d_fecha_campania: string;
  d_fin_campania: string;
  b_activo: number;
  s_comentario: string;
  s_img_campania: string;
  s_origen_campania?: string;
  s_estatus_campania?: string;

  constructor(campaniaPublicitariaModel: Partial<campaniaPublicitariaModel> = {}) {
    {
      this.id_campania_publicitaria = campaniaPublicitariaModel.id_campania_publicitaria || this.getRandomID();
      this.id_origen_campania = campaniaPublicitariaModel.id_origen_campania || 0;
      this.id_estatus_campania = campaniaPublicitariaModel.id_estatus_campania || 0;
      this.s_campania_publicitaria = campaniaPublicitariaModel.s_campania_publicitaria || '';
      this.d_fecha_campania = campaniaPublicitariaModel.d_fecha_campania || formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.d_fin_campania = campaniaPublicitariaModel.d_fin_campania || '';
      this.b_activo = campaniaPublicitariaModel.b_activo !== undefined ? campaniaPublicitariaModel.b_activo : 1;
      this.s_comentario = campaniaPublicitariaModel.s_comentario || '';
      this.s_img_campania = campaniaPublicitariaModel.s_img_campania || 'campania-default.png';
      this.s_origen_campania = campaniaPublicitariaModel.s_origen_campania || '';
      this.s_estatus_campania = campaniaPublicitariaModel.s_estatus_campania || '';
    }
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}