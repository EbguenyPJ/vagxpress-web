import { formatDate } from '@angular/common';

export class refaccionInsertadaModel {
  id_refaccion: number;
  s_nombre_refaccion: string;
  s_marca_refaccion: string;
  s_categoria_refaccion: string;
  s_subcategoria_refaccion: string;
  s_clase_refaccion: string;
  s_numero_parte: string;
  n_cantidad: number;
  d_fecha_creacion: string;
  

  constructor(data: Partial<refaccionInsertadaModel> = {}) {
    this.id_refaccion = data.id_refaccion   || this.getRandomID();
    this.s_nombre_refaccion = data.s_nombre_refaccion || '';
    this.s_marca_refaccion = data.s_marca_refaccion || '';
    this.s_categoria_refaccion = data.s_categoria_refaccion || '';
    this.s_subcategoria_refaccion = data.s_subcategoria_refaccion || '';
    this.s_clase_refaccion = data.s_clase_refaccion || '';
    this.s_numero_parte = data.s_numero_parte || '';
    this.n_cantidad = data.n_cantidad || 0;
    this.d_fecha_creacion = data.d_fecha_creacion || '';

  }

  private getRandomID(): number {
    return Math.floor(Math.random() * 1000000);
  }
}