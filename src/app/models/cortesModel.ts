export class cortesModel {
    id_corte: number;
    id_tipo_corte: number;
    id_usuario_crea: number;
    nombre_usuario?: string; // <-- nuevo campo
    d_fecha_corte: string;
    n_monto_efectivo: number;
    n_monto_transferencia: number;
    n_monto_credito: number;
    n_monto_tarjeta_debito: number;
    n_monto_tarjeta_credito: number;
    n_monto_total: number;
    s_descripcion_corte: string;
    s_comentario: string;
    created_at: string;
    updated_at: string;
    b_activo: number;

    constructor(data: Partial<cortesModel> = {}) {
        this.id_corte = data.id_corte || 0;
        this.id_tipo_corte = data.id_tipo_corte || 0;
        this.id_usuario_crea = data.id_usuario_crea || 0;
        this.nombre_usuario = data.nombre_usuario || '';
        this.d_fecha_corte = data.d_fecha_corte || '';
        this.n_monto_efectivo = data.n_monto_efectivo || 0;
        this.n_monto_transferencia = data.n_monto_transferencia || 0;
        this.n_monto_credito = data.n_monto_credito || 0;
        this.n_monto_tarjeta_debito = data.n_monto_tarjeta_debito || 0;
        this.n_monto_tarjeta_credito = data.n_monto_tarjeta_credito || 0;
        this.n_monto_total = data.n_monto_total || 0;
        this.s_descripcion_corte = data.s_descripcion_corte || '';
        this.s_comentario = data.s_comentario || '';
        this.created_at = data.created_at || '';
        this.updated_at = data.updated_at || '';
        this.b_activo = data.b_activo ?? 1;
    }
}
