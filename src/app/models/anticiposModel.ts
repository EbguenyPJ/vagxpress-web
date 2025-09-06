import { formatDate } from '@angular/common';

export class anticiposModel {
  id_anticipo: number;
  id_orden_servicio_origen: number;
  id_orden_servicio_aplicada: number;
  id_cliente: number;
  id_servicio_anticipado: number;
  id_promocion: number | null;
  id_estatus_anticipo: number;
  d_fecha_proximo_servicio: string;
  n_importe: number;
  d_fecha_registro: string;
  b_activo: number;
  
  // Campos de relaciones
  s_nombre_cliente?: string;
  s_apellido_paterno_cliente?: string;
  s_apellido_materno_cliente?: string;
  s_servicio?: string;
  s_descripcion_servicio?: string;
  n_precio_servicio?: number;
  s_promocion?: string | null;
  s_estatus_anticipo?: string;

  constructor(anticiposModel: Partial<anticiposModel> = {}) {
    {
      this.id_anticipo = anticiposModel.id_anticipo || this.getRandomID();
      this.id_orden_servicio_origen = anticiposModel.id_orden_servicio_origen || 0;
      this.id_orden_servicio_aplicada = anticiposModel.id_orden_servicio_aplicada || 0;
      this.id_cliente = anticiposModel.id_cliente || 0;
      this.id_servicio_anticipado = anticiposModel.id_servicio_anticipado || 0;
      this.id_promocion = anticiposModel.id_promocion || null;
      this.id_estatus_anticipo = anticiposModel.id_estatus_anticipo || 0;
      this.d_fecha_proximo_servicio = anticiposModel.d_fecha_proximo_servicio || formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.n_importe = anticiposModel.n_importe || 0;
      this.d_fecha_registro = anticiposModel.d_fecha_registro || formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
      this.b_activo = anticiposModel.b_activo || 1;
      
      // Campos de relaciones
      this.s_nombre_cliente = anticiposModel.s_nombre_cliente || '';
      this.s_apellido_paterno_cliente = anticiposModel.s_apellido_paterno_cliente || '';
      this.s_apellido_materno_cliente = anticiposModel.s_apellido_materno_cliente || '';
      this.s_servicio = anticiposModel.s_servicio || '';
      this.s_descripcion_servicio = anticiposModel.s_descripcion_servicio || '';
      this.n_precio_servicio = anticiposModel.n_precio_servicio || 0;
      this.s_promocion = anticiposModel.s_promocion || null;
      this.s_estatus_anticipo = anticiposModel.s_estatus_anticipo || '';
    }
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}