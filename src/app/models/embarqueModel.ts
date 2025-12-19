import { formatDate } from '@angular/common';

export class embarqueModel {
  id_embarque: number;
  id_proveedor: number;
  s_proveedor: string;
  d_fecha_creacion: string;
  id_usuario_crea: number;
  s_nombre_completo: string;
  id_estatus_embarque: number;
  

  constructor(data: Partial<embarqueModel> = {}) {
    this.id_embarque = data.id_embarque   || this.getRandomID();
    this.id_proveedor = data.id_proveedor || 0;
    this.s_proveedor = data.s_proveedor || '';
    this.d_fecha_creacion = data.d_fecha_creacion || formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
    this.id_usuario_crea = data.id_usuario_crea || 0;
    this.s_nombre_completo = data.s_nombre_completo || '';
    this.id_estatus_embarque = data.id_estatus_embarque || 0;
  }

  private getRandomID(): number {
    return Math.floor(Math.random() * 1000000);
  }
}