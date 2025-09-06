import { formatDate } from '@angular/common';

export class catalogoModel {
  id_catalogo: number;
  s_catalogo: string;
  s_nombre_table: string;
  b_funciones_activas: boolean;
  b_activo: boolean;

  constructor(catalogoModel: Partial<catalogoModel> = {}) {
    {
      this.id_catalogo = catalogoModel.id_catalogo || this.getRandomID();
      this.s_catalogo = catalogoModel.s_catalogo || '';
      this.s_nombre_table = catalogoModel.s_nombre_table || '';
      this.b_funciones_activas = catalogoModel.b_funciones_activas !== undefined ? catalogoModel.b_funciones_activas : true;
      this.b_activo = catalogoModel.b_activo !== undefined ? catalogoModel.b_activo : true;
    }
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}