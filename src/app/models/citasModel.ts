import { formatDate } from '@angular/common';

export class citasModel {
    id_cita:            number;
    s_qr_cita:          string;
    id_cliente:         number;
    s_nombre:           string;
    s_apellido_paterno: string;
    s_apellido_materno: string;
    n_telefono:         string;
    id_vehiculo:        number;
    s_marca_vehiculo:   string;
    s_modelo_vehiculo:  string;
    s_tipo_motor:       string;
    s_tipo_carroceria:  string;
    s_tipo_inyeccion:   string;
    n_numero_cilindros: number;
    n_anio:             number;
    s_placa:            string;
    s_vin:              string;
    s_kilometraje:      number;
    id_servicio:        number;
    id_tipo_servicio:   number;
    s_tipo_servicio:    string;
    s_servicio:         string;
    s_descripcion:      string;
    n_precio:           number;
    s_img_info:         string;
    id_estatus_cita:    number;
    s_estatus_cita:     string;
    id_sucursal:        number;
    s_sucursal:         string;
    s_direccion:        string;
    s_nombre_corto:     string;
    id_usuario_ventas:  number;
    s_usuario_ventas:   string;
    s_apellido_paterno_usuario_ventas:   string;
    id_promocion:       number;
    s_promocion:        string;
    n_porcentaje_descuento:       number;
    d_fecha_cita:       string;
    t_hora_cita:        string;
    qr_url:             string;
    b_activo:           number;
    s_comentario_cita:  string;
    s_url_qr_cita:      string;
    d_fecha_registro:   string;
    n_total_servicios_adicionales: number;
    id_usuario_edita:   number;
    s_usuario_edita: string;
    s_apellido_paterno_usuario_edita: string;
    id_usuario_cancela:   number;
    s_usuario_cancela: string;
    s_apellido_paterno_usuario_cancela: string;
    s_comentario_cancelar_cita: string;
    qrBase64: string;
    id_tipo_promocion: number;
    n_descuento: number;

  
    constructor(citasModel: Partial<citasModel> = {}) {
      this.id_cita            = citasModel.id_cita            || this.getRandomID();
      this.s_qr_cita          = citasModel.s_qr_cita          !; 
      this.id_cliente         = citasModel.id_cliente         !;         
      this.s_nombre           = citasModel.s_nombre           !;           
      this.s_apellido_paterno = citasModel.s_apellido_paterno !;
      this.s_apellido_materno = citasModel.s_apellido_materno !;
      this.n_telefono         = citasModel.n_telefono         !;
      this.id_vehiculo        = citasModel.id_vehiculo        !;
      this.s_marca_vehiculo   = citasModel.s_marca_vehiculo   !;
      this.s_modelo_vehiculo  = citasModel.s_modelo_vehiculo  !;
      this.s_tipo_motor       = citasModel.s_tipo_motor       !;
      this.s_tipo_carroceria  = citasModel.s_tipo_carroceria  !;
      this.s_tipo_inyeccion   = citasModel.s_tipo_inyeccion   !;
      this.n_numero_cilindros = citasModel.n_numero_cilindros !;
      this.n_anio             = citasModel.n_anio             || new Date().getFullYear();
      this.s_placa            = citasModel.s_placa            !;
      this.s_vin              = citasModel.s_vin              !;
      this.s_kilometraje      = citasModel.s_kilometraje      !;
      this.id_servicio        = citasModel.id_servicio        !;
      this.id_tipo_servicio   = citasModel.id_tipo_servicio   !;
      this.s_tipo_servicio    = citasModel.s_tipo_servicio    !;
      this.s_servicio         = citasModel.s_servicio         !;
      this.s_descripcion      = citasModel.s_descripcion      !;
      this.n_precio           = citasModel.n_precio           !;
      this.s_img_info         = citasModel.s_img_info         !;
      this.id_estatus_cita    = citasModel.id_estatus_cita    !;
      this.s_estatus_cita     = citasModel.s_estatus_cita     !;
      this.id_sucursal        = citasModel.id_sucursal        !;
      this.s_sucursal         = citasModel.s_sucursal         !;
      this.s_direccion        = citasModel.s_direccion        !;
      this.s_nombre_corto     = citasModel.s_nombre_corto     !;
      this.id_usuario_ventas  = citasModel.id_usuario_ventas  !;
      this.s_usuario_ventas   = citasModel.s_usuario_ventas   !;
      this.s_apellido_paterno_usuario_ventas   = citasModel.s_apellido_paterno_usuario_ventas   !;
      this.id_promocion       = citasModel.id_promocion       !;
      this.s_promocion        = citasModel.s_promocion        !;
      this.n_porcentaje_descuento      = citasModel.n_porcentaje_descuento       !;      
      this.d_fecha_cita       = citasModel.d_fecha_cita       || formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.t_hora_cita        = citasModel.t_hora_cita        || formatDate(new Date(), 'HH:mm', 'en');
      this.qr_url             = citasModel.qr_url             !;
      this.b_activo           = citasModel.b_activo           || 1;
      this.s_comentario_cita  = citasModel.s_comentario_cita  !;
      this.s_url_qr_cita      = citasModel.s_url_qr_cita      !;
      this.d_fecha_registro   = citasModel.d_fecha_registro   !;
      this.n_total_servicios_adicionales = citasModel.n_total_servicios_adicionales !;
      this.id_usuario_edita   = citasModel.id_usuario_edita   !;
      this.s_usuario_edita    = citasModel.s_usuario_edita    !;
      this.s_apellido_paterno_usuario_edita = citasModel.s_apellido_paterno_usuario_edita !;
      this.id_usuario_cancela   = citasModel.id_usuario_cancela   !;
      this.s_usuario_cancela  = citasModel.s_usuario_cancela    !;
      this.s_apellido_paterno_usuario_cancela = citasModel.s_apellido_paterno_usuario_cancela !;
      this.s_comentario_cancelar_cita = citasModel.s_comentario_cancelar_cita !;
      this.qrBase64 = citasModel.qrBase64 !;
      this.id_tipo_promocion = citasModel.id_tipo_promocion !;
      this.n_descuento = citasModel.n_descuento !;

    }
  
    public getRandomID(): number {
      const S4 = () => {
        return ((1 + Math.random()) * 0x10000) | 0;
      };
      return S4() + S4();
    } 
}