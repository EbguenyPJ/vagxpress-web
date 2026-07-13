/**
 * Interfaces de dominio del API. Los nombres de campo replican las columnas
 * del backend (convención s_/n_/b_/id_) porque las plantillas los enlazan
 * directamente.
 */

export interface ModuloUsuario {
  id_modulo: number;
  id_usuario: number;
  id_categoria_modulo: number | null;
  s_categoria_modulo: string | null;
  s_modulo: string | null;
  s_ruta: string | null;
  s_icono: string | null;
}

export interface Usuario {
  id: number;
  name: string;
  email: string | null;
  s_nombre_completo: string | null;
  id_empleado: number | null;
  id_tipo_usuario: number | null;
  b_usuario_web: boolean;
  b_usuario_movil: boolean;
  b_activo: boolean;
  created_at?: string;
}

export interface Cliente {
  id_cliente: number;
  s_nombre_cliente: string;
  s_razon_social: string | null;
  s_rfc: string | null;
  s_ine: string | null;
  s_numero_telefono: string | null;
  s_correo: string | null;
  s_comentario: string | null;
  n_saldo_actual: string | number;
  n_limite_credito: string | number;
  id_tipo_cliente: number | null;
  s_tipo_cliente?: string | null;
  b_credito: boolean;
  b_activo: boolean;
}

export interface ClienteSelector {
  id_cliente: number;
  s_nombre_cliente: string;
  saldo_actual: string | number;
}

export interface Proveedor {
  id_proveedor: number;
  s_proveedor: string;
  s_nombre_contacto: string | null;
  s_telefono: string | null;
  s_rfc: string | null;
  s_img_proveedor: string | null;
  b_activo: boolean;
}

export interface Empleado {
  id_empleado: number;
  s_nombre: string;
  s_apellido_paterno: string | null;
  s_apellido_materno: string | null;
  s_foto_empleado: string | null;
  s_rfc: string | null;
  s_curp: string | null;
  s_correo: string | null;
  s_direccion: string | null;
  s_telefono: string | null;
  s_contacto_emergencia: string | null;
  s_telefono_contacto_emergencia: string | null;
  s_qr_empleado: string | null;
  d_fecha_nacimiento: string | null;
  d_fecha_ingreso: string | null;
  id_tipo_empleado: number | null;
  s_tipo_empleado?: string | null;
  id_profesion: number | null;
  s_profesion?: string | null;
  id_grado_estudios: number | null;
  s_grado_estudios?: string | null;
  id_sucursal: number | null;
  s_sucursal?: string | null;
  id_estado_disponibilidad: number | null;
  s_estado_disponibilidad?: string | null;
  id_sexo: number | null;
  b_es_usuario: boolean;
  b_activo: boolean;
}

export interface HabilidadEmpleado {
  id_habilidad_empleado: number;
  id_habilidad: number;
  id_empleado: number;
  n_nivel_dominio: number;
  b_activo: boolean;
  s_habilidad_empleado: string | null;
  s_tipo_empleado: string | null;
}

export interface RefaccionListado {
  id_refaccion: number;
  s_nombre_refaccion: string;
  s_numero_parte: string | null;
  n_precio_venta: string | number;
  s_codigo_qr: string | null;
  s_marca_refaccion: string | null;
  s_categoria_refaccion: string | null;
  id_subcategoria_refaccion: number | null;
  s_subcategoria_refaccion: string | null;
  s_imagen_refaccion: string | null;
  n_stock_actual: number;
  id_estatus_refaccion: number | null;
  s_estatus_refaccion: string | null;
  s_color_estatus_refaccion: string | null;
  id_clase_refaccion: number | null;
  s_clase_refaccion: string | null;
  s_color_clase_refaccion: string | null;
}

export interface RefaccionEquivalente {
  id_refaccion: number;
  s_nombre_refaccion: string;
  s_numero_parte: string | null;
  s_marca_refaccion: string | null;
  s_imagen_refaccion: string | null;
}

export interface RefaccionDetalle extends RefaccionListado {
  s_descripcion: string | null;
  s_codigo_interno: string | null;
  n_precio_compra: string | number;
  n_precio_mayoreo: string | number | null;
  n_stock_minimo: number | null;
  n_tiempo_reposicion: number | null;
  id_marca_refaccion: number | null;
  id_unidad_medida: number | null;
  s_unidad_medida: string | null;
  id_proveedor: number | null;
  s_proveedor: string | null;
  id_categoria_refaccion: number | null;
  id_posicion_vehiculo: number | null;
  s_posicion_vehiculo: string | null;
  id_ubicacion_almacen: number | null;
  s_ubicacion_almacen: string | null;
  b_importado: boolean;
  refacciones_equivalentes: RefaccionEquivalente[];
}

export interface Venta {
  id_venta: number;
  n_subtotal: string | number;
  n_porcentaje_iva: string | number;
  n_total: string | number;
  n_cantidad_refacciones: number;
  id_estatus_venta: number;
  s_estatus_venta: string | null;
  id_metodo_pago: number;
  s_metodo_pago: string | null;
  id_cliente: number;
  s_nombre_cliente: string | null;
  fecha_venta: string;
}

export interface Corte {
  id_corte: number;
  id_tipo_corte: number;
  id_usuario_crea: number;
  s_nombre_completo: string | null;
  d_fecha_corte: string;
  n_monto_efectivo: string | number;
  n_monto_transferencia: string | number;
  n_monto_credito: string | number;
  n_monto_tarjeta_debito: string | number;
  n_monto_tarjeta_credito: string | number;
  n_monto_total: string | number;
  s_descripcion_corte: string | null;
  s_comentario: string | null;
  b_activo: boolean;
  created_at?: string;
}

export interface RequisicionListado {
  id_requisicion: number;
  n_cantidad_refacciones: number;
  n_total_estimado: string | number;
  id_estatus_requisicion: number;
  s_estatus_requisicion: string | null;
  id_tipo_requisicion: number;
  s_tipo_requisicion: string | null;
}

export interface OrdenCompraListado {
  id_orden_compra: number;
  s_folio_interno: string | null;
  id_requisicion: number;
  id_proveedor: number | null;
  s_proveedor: string | null;
  d_fecha_orden: string | null;
  d_fecha_recepcion_estimada: string | null;
  n_total_estimado: string | number;
  id_estatus_orden_compra: number;
  s_estatus_orden_compra: string | null;
}

export interface EmbarqueResumen {
  id_embarque: number;
  id_proveedor: number;
  s_proveedor: string | null;
  d_fecha_creacion: string;
  id_usuario_crea: number;
  s_nombre_completo: string | null;
  id_estatus_embarque: number;
  s_estatus_embarque: string | null;
}

export interface Gasto {
  id_gasto: number;
  id_tipo_gasto: number;
  id_tipo_evidencia: number | null;
  id_sucursal: number;
  n_cantidad: number;
  n_costo: string | number;
  s_concepto: string;
  s_evidencia: string | null;
  d_fecha_gasto: string;
  d_fecha_creacion: string;
  id_usuario_crea: number | null;
  b_activo: boolean;
  b_movil: boolean;
  s_sucursal: string | null;
  s_tipo_gasto: string | null;
  s_categoria_gasto: string | null;
  usuario_crea: string | null;
  url_evidencia: string | null;
}

export interface OrdenReparto {
  id_orden: number;
  id_destino: number | null;
  s_nombre_destino: string | null;
  s_direccion: string | null;
  s_referencia_destino: string | null;
  s_nota_refaccionista: string | null;
  id_repartidor: number | null;
  d_fecha_asignacion: string | null;
  id_estatus_orden: number;
  s_estatus_orden: string | null;
  d_fecha_entrega: string | null;
  s_nombre_recibe: string | null;
  s_firma: string | null;
}

/** Fila genérica de catálogo (tc_*). */
export type FilaCatalogo = Record<string, string | number | boolean | null>;
