import { formatDate } from '@angular/common';

export class clientesModel {
  id_cliente: number;
  id_tipo_cliente: number;
  id_categoria_cliente: number;
  id_origen_campania: number;
  id_campania_publicitaria: number;
  id_cliente_recomendacion?: number;
  id_estatus_cliente: number;
  id_sucursal: number;
  s_nombre: string;
  s_apellido_paterno: string;
  s_apellido_materno: string;
  s_foto_cliente: string;
  n_telefono: string;
  s_correo: string;
  s_direccion: string;
  s_rfc: string;
  s_tipo_cliente?: string;
  s_categoria_cliente?: string;
  s_origen_campania?: string;
  s_campania_publicitaria?: string;
  s_estatus_cliente?: string;
  s_comentario: string;
  s_nombre_sucursal?: string;
  b_activo: string;
  created_at: string;
  updated_at: string;

  constructor(clientesModel: Partial<clientesModel> = {}) {
    this.id_cliente = clientesModel.id_cliente || this.getRandomID();
    this.id_tipo_cliente = clientesModel.id_tipo_cliente || 0;
    this.id_categoria_cliente = clientesModel.id_categoria_cliente || 0;
    this.id_origen_campania = clientesModel.id_origen_campania || 0;
    this.id_campania_publicitaria = clientesModel.id_campania_publicitaria || 0;
    this.id_cliente_recomendacion = clientesModel.id_cliente_recomendacion;
    this.id_estatus_cliente = clientesModel.id_estatus_cliente || 0;
    this.id_sucursal = clientesModel.id_sucursal || 0;
    this.s_nombre = clientesModel.s_nombre || '';
    this.s_apellido_paterno = clientesModel.s_apellido_paterno || '';
    this.s_apellido_materno = clientesModel.s_apellido_materno || '';
    this.s_foto_cliente = clientesModel.s_foto_cliente || 'avatar-cliente.png';
    this.n_telefono = clientesModel.n_telefono || '';
    this.s_correo = clientesModel.s_correo || '';
    this.s_direccion = clientesModel.s_direccion || '';
    this.s_rfc = clientesModel.s_rfc || '';
    this.s_tipo_cliente = clientesModel.s_tipo_cliente;
    this.s_categoria_cliente = clientesModel.s_categoria_cliente;
    this.s_origen_campania = clientesModel.s_origen_campania;
    this.s_campania_publicitaria = clientesModel.s_campania_publicitaria;
    this.s_estatus_cliente = clientesModel.s_estatus_cliente;
    this.s_comentario = clientesModel.s_comentario || '';
    this.s_nombre_sucursal = clientesModel.s_nombre_sucursal;
    this.b_activo = clientesModel.b_activo || '';
    this.created_at = clientesModel.created_at || formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
    this.updated_at = clientesModel.updated_at || formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}