import { formatDate } from '@angular/common';

export class clientesModel {
  // ===== tw_clientes =====
  id_cliente: number;
  s_nombre_cliente: string;
  s_razon_social: string;
  s_rfc: string;
  s_ine: string;
  s_numero_telefono: string;
  s_correo: string;
  s_comentario: string;

  n_saldo_actual: number;
  n_limite_credito: number;

  id_tipo_cliente: number;

  id_usuario_crea: number;
  id_usuario_modifica: number;

  b_credito: number;
  b_activo: number;

  created_at: string;
  updated_at: string;

  // ===== JOIN tc_tipos_clientes =====
  s_tipo_cliente?: string;

  constructor(data: Partial<clientesModel> = {}) {
    this.id_cliente = data.id_cliente || this.getRandomID();
    this.s_nombre_cliente = data.s_nombre_cliente || '';
    this.s_razon_social = data.s_razon_social || '';
    this.s_rfc = data.s_rfc || '';
    this.s_ine = data.s_ine || '';
    this.s_numero_telefono = data.s_numero_telefono || '';
    this.s_correo = data.s_correo || '';
    this.s_comentario = data.s_comentario || '';

    this.n_saldo_actual = data.n_saldo_actual || 0;
    this.n_limite_credito = data.n_limite_credito || 0;

    this.id_tipo_cliente = data.id_tipo_cliente || 0;

    this.id_usuario_crea = data.id_usuario_crea || 0;
    this.id_usuario_modifica = data.id_usuario_modifica || 0;

    this.b_credito = data.b_credito ?? 0;
    this.b_activo = data.b_activo ?? 1;

    this.created_at =
      data.created_at ||
      formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
    this.updated_at =
      data.updated_at ||
      formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');

    // JOIN
    this.s_tipo_cliente = data.s_tipo_cliente;
  }

  private getRandomID(): number {
    return Math.floor(Math.random() * 1000000);
  }
}