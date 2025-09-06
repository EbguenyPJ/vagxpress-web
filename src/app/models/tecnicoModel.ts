export class tecnicoModel {
  id_tecnico: number;
  s_nombre: string;
  s_foto_tecnico: string;
  n_servicios: number;
  n_horas_asignadas: number;
  n_horas_logradas: number;
  s_sucursal: string;
  s_insignia: string;

  constructor(tecnicoModel: Partial<tecnicoModel> = {}) {
    this.id_tecnico = tecnicoModel.id_tecnico || this.getRandomID();
    this.s_nombre = tecnicoModel.s_nombre || '';
    this.s_foto_tecnico = tecnicoModel.s_foto_tecnico || 'default-user.png';
    this.n_servicios = tecnicoModel.n_servicios || 0;
    this.n_horas_asignadas = tecnicoModel.n_horas_asignadas || 0;
    this.n_horas_logradas = tecnicoModel.n_horas_logradas || 0;
    this.s_sucursal = tecnicoModel.s_sucursal || '';
    this.s_insignia = tecnicoModel.s_insignia || 'default-insignia.png';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
