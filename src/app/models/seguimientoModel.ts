import { formatDate } from '@angular/common';

export class seguimientoModel {
  id_seguimiento: number;
  id_cliente: number;
  id_medio_contacto: number;
  id_estatus_seguimiento: number;
  id_imagen: string;
  s_comentario: string;
  b_activo: number;
  created_at: string;
  updated_at: string;

  constructor(seguimientoModel: Partial<seguimientoModel> = {}) {
    {
      this.id_seguimiento = seguimientoModel.id_seguimiento || this.getRandomID();
      this.id_cliente = seguimientoModel.id_cliente || 0;
      this.id_medio_contacto = seguimientoModel.id_medio_contacto || 0;
      this.id_estatus_seguimiento = seguimientoModel.id_estatus_seguimiento || 0;
      this.id_imagen = seguimientoModel.id_imagen || '';
      this.s_comentario = seguimientoModel.s_comentario || '';
      this.b_activo = seguimientoModel.b_activo !== undefined ? seguimientoModel.b_activo : 1;
      this.created_at = seguimientoModel.created_at || formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
      this.updated_at = seguimientoModel.updated_at || formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
    }
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}