export class refaccionModel {
    id_refaccion: number;
    s_nombre_refaccion: string;
    s_numero_parte: string;
    n_precio_venta: number;
    s_marca_refaccion: string;
    s_categoria_refaccion: string;
    s_subcategoria_refaccion: string;
    s_imagen_refaccion: string;
    n_stock_actual: number;
    s_estatus_refaccion: string;
    s_codigo_qr: string;

    constructor(refaccion: Partial<refaccionModel> = {}) {
        this.id_refaccion = refaccion.id_refaccion!;
        this.s_nombre_refaccion = refaccion.s_nombre_refaccion!;
        this.s_numero_parte = refaccion.s_numero_parte!;
        this.n_precio_venta = Number(refaccion.n_precio_venta) || 0; // Convertir a número
        this.s_marca_refaccion = refaccion.s_marca_refaccion!;
        this.s_categoria_refaccion = refaccion.s_categoria_refaccion!;
        this.s_subcategoria_refaccion = refaccion.s_subcategoria_refaccion!;
        this.s_imagen_refaccion = refaccion.s_imagen_refaccion!;
        this.n_stock_actual = refaccion.n_stock_actual!;
        this.s_estatus_refaccion = refaccion.s_estatus_refaccion!;
        this.s_codigo_qr = refaccion.s_codigo_qr!;
    }
}
