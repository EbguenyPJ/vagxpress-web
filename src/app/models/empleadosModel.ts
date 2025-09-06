import { formatDate } from '@angular/common';

export class empleadosModel {
  id_empleado: number;
  id_tipo_empleado: number;
  id_profesion: number;
  id_grado_estudios: number;
  id_sucursal: number;
  id_sexo: number;
  s_nombre: string;
  s_apellido_paterno: string;
  s_apellido_materno: string;
  s_foto_empleado: string;
  n_telefono: string;
  n_telefono_contacto_emergencia: string;
  s_correo: string;
  s_direccion: string;
  d_fecha_nacimiento: string;
  d_fecha_ingreso: string;
  s_sucursal: string;
  s_tipo_empleado: string;
  s_estado_disponibilidad: string;
  b_activo: string;

  constructor(empleadosModel: Partial<empleadosModel> = {}) {
    {
      this.id_empleado = empleadosModel.id_empleado || this.getRandomID();
      this.id_tipo_empleado = empleadosModel.id_tipo_empleado || 0;
      this.id_profesion = empleadosModel.id_profesion || 0;
      this.id_grado_estudios = empleadosModel.id_grado_estudios || 0;
      this.id_sucursal = empleadosModel.id_sucursal || 0;
      this.id_sexo = empleadosModel.id_sexo || 0;
      this.s_nombre = empleadosModel.s_nombre || '';
      this.s_apellido_paterno = empleadosModel.s_apellido_paterno || '';
      this.s_apellido_materno = empleadosModel.s_apellido_materno || '';
      this.s_foto_empleado = empleadosModel.s_foto_empleado || 'empleado-default.png';
      this.n_telefono = empleadosModel.n_telefono || '';
      this.n_telefono_contacto_emergencia = empleadosModel.n_telefono_contacto_emergencia || '';
      this.s_correo = empleadosModel.s_correo || '';
      this.s_direccion = empleadosModel.s_direccion || '';
      this.d_fecha_nacimiento = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.d_fecha_ingreso = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.s_tipo_empleado = empleadosModel.s_tipo_empleado || '';
      this.s_sucursal = empleadosModel.s_sucursal || '';
      this.s_estado_disponibilidad = empleadosModel.s_estado_disponibilidad || '';
      this.b_activo = empleadosModel.b_activo || '';
    }
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
