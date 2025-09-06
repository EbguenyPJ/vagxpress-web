import { formatDate } from '@angular/common';

export class vehiculosModel {
  id_vehiculo:         number;
  id_cliente:          string | null;
  id_marca_vehiculo:   number | null;
  s_marca_vehiculo:    string | null;
  id_modelo_vehiculo:  number | null;
  s_modelo_vehiculo:   string | null;
  id_tipo_motor:       number | null;
  id_tipo_carroceria:  number | null;
  id_tipo_inyeccion:   number | null;
  id_cilindro_motor:   number | null;
  n_numero_cilindros:  number | null;
  n_anio:              number;
  s_placa:             string;
  s_vin:               string;
  s_kilometraje:       number;
  b_activo:            number;

  constructor(vehiculosModel: Partial<vehiculosModel> = {}) {
    this.id_vehiculo         = vehiculosModel.id_vehiculo        || this.getRandomID();
    this.id_cliente          = vehiculosModel.id_cliente         ?? null;
    this.id_marca_vehiculo   = vehiculosModel.id_marca_vehiculo  ?? null;
    this.s_marca_vehiculo    = vehiculosModel.s_marca_vehiculo   ?? null;
    this.id_modelo_vehiculo  = vehiculosModel.id_modelo_vehiculo ?? null;
    this.s_modelo_vehiculo   = vehiculosModel.s_modelo_vehiculo  ?? null;
    this.id_tipo_motor       = vehiculosModel.id_tipo_motor      ?? null;
    this.id_tipo_carroceria  = vehiculosModel.id_tipo_carroceria ?? null;
    this.id_tipo_inyeccion   = vehiculosModel.id_tipo_inyeccion  ?? null;
    this.id_cilindro_motor   = vehiculosModel.id_cilindro_motor  ?? null;
    this.n_numero_cilindros  = vehiculosModel.n_numero_cilindros ?? null;
    this.n_anio              = vehiculosModel.n_anio             || new Date().getFullYear();
    this.s_placa             = vehiculosModel.s_placa            || "";
    this.s_vin               = vehiculosModel.s_vin              || "";
    this.s_kilometraje       = vehiculosModel.s_kilometraje      || 0;
    this.b_activo            = vehiculosModel.b_activo           ?? 1;
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
  