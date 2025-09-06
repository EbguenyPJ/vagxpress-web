import { formatDate } from '@angular/common';

export class usuariosModel {
  id: number;
  name: string;
  email: string;
  s_nombre_completo: string;
  b_activo: string;
  id_empleado: any;
  password: any;
  id_tipo_usuario: any;
  b_usuario_web: string;
  b_usuario_movil: string;

  constructor(usuariosModel: Partial<usuariosModel> = {}) {
    {
      this.id = usuariosModel.id || this.getRandomID();
      this.name = usuariosModel.name || '';
      this.email = usuariosModel.email || '';
      this.s_nombre_completo = usuariosModel.s_nombre_completo || '';
      this.b_activo = usuariosModel.b_activo || '';
      this.id_empleado = usuariosModel.id_empleado || '';
      this.password = usuariosModel.password || '';
      this.id_tipo_usuario = usuariosModel.id_tipo_usuario || '';
      this.b_usuario_web = usuariosModel.b_usuario_web || '';
      this.b_usuario_movil = usuariosModel.b_usuario_movil || '';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
