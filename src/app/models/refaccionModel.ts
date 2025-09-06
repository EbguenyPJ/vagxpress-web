export class RefaccionModel {
  id_refaccion: number;
  s_refaccion: string;
  id_tipo_refaccion: number;
  id_marca_refaccion: number;
  id_clase_refaccion: number;
  s_numero_parte: string;
  s_img_refaccion: string;
  s_codigo_refaccion: string;
  n_precio: number;
  n_cantidad_existencias: number;
  s_descripcion: string;
  s_comentario: string;
  b_activo: number;

  // Campos adicionales relacionados
  s_tipo_refaccion?: string;
  s_marca_refaccion?: string;
  s_clase_refaccion?: string;

  constructor(refaccion?: Partial<RefaccionModel>) {
    this.id_refaccion = refaccion?.id_refaccion || this.getRandomID();
    this.s_refaccion = refaccion?.s_refaccion || '';
    this.id_tipo_refaccion = refaccion?.id_tipo_refaccion || 0;
    this.id_marca_refaccion = refaccion?.id_marca_refaccion || 0;
    this.id_clase_refaccion = refaccion?.id_clase_refaccion || 0;
    this.s_numero_parte = refaccion?.s_numero_parte || '';
    this.s_img_refaccion = refaccion?.s_img_refaccion || 'refacciones/default.png';
    this.s_codigo_refaccion = refaccion?.s_codigo_refaccion || '';
    this.n_precio = refaccion?.n_precio || 0;
    this.n_cantidad_existencias = refaccion?.n_cantidad_existencias || 0;
    this.s_descripcion = refaccion?.s_descripcion || '';
    this.s_comentario = refaccion?.s_comentario || '';
    this.b_activo = refaccion?.b_activo ?? 1;

    this.s_tipo_refaccion = refaccion?.s_tipo_refaccion || '';
    this.s_marca_refaccion = refaccion?.s_marca_refaccion || '';
    this.s_clase_refaccion = refaccion?.s_clase_refaccion || '';
  }

  private getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
