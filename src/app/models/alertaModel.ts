import { formatDate } from '@angular/common';

export class alertaModel {
  // Campos principales (de tw_alertas)
  id_alerta: number;
  id_tipo_alerta: number;
  s_alerta: string;
  s_descripcion: string;
  d_fecha_registro: string;
  t_hora_registro: string;
  b_activo: number;
  
  // Campos de relación (de tc_tipos_alertas)
  s_tipo_alerta?: string;
  n_duracion_alerta?: number;
  s_icono?: string;
  s_color?: string;
  minutos_transcurridos?: number;

  constructor(alerta: Partial<alertaModel> = {}) {
    {
      this.id_alerta = alerta.id_alerta || this.getRandomID();
      this.id_tipo_alerta = alerta.id_tipo_alerta || 0;
      this.s_alerta = alerta.s_alerta || '';
      this.s_descripcion = alerta.s_descripcion || '';
      this.d_fecha_registro = alerta.d_fecha_registro || formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.t_hora_registro = alerta.t_hora_registro || formatDate(new Date(), 'HH:mm:ss', 'en');
      this.b_activo = alerta.b_activo !== undefined ? alerta.b_activo : 1;
      
      // Campos de relación
      this.s_tipo_alerta = alerta.s_tipo_alerta || '';
      this.n_duracion_alerta = alerta.n_duracion_alerta || 0;
      this.s_icono = alerta.s_icono || '';
      this.s_color = alerta.s_color || '';
      this.minutos_transcurridos = alerta.minutos_transcurridos || 0;
    }
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}