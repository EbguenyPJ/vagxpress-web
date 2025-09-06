interface RefaccionSugerida {
  n_cantidad: number,
  s_refaccion: string,
}

export class ServicioSugeridoModel {
    id_servicio_sugerido:   number | null;
    id_revision:            number | null;
    s_comentario_revision:  string;
    id_punto_seguridad:     number | null;
    id_servicio:            number | null;
    s_servicio:             string;
    s_descripcion:          string;
    n_precio:               number;
    n_duracion_horas:       number;
    refacciones:            RefaccionSugerida[];

    constructor(servicioSugerido: Partial<ServicioSugeridoModel> = {}) {
        this.id_servicio_sugerido   = servicioSugerido.id_servicio_sugerido || this.getRandomID();
        this.id_revision            = servicioSugerido.id_revision            || null;
        this.s_comentario_revision  = servicioSugerido.s_comentario_revision  || '';
        this.id_punto_seguridad     = servicioSugerido.id_punto_seguridad     || null;
        this.id_servicio            = servicioSugerido.id_servicio            || null;
        this.s_servicio             = servicioSugerido.s_servicio             || '';
        this.s_descripcion          = servicioSugerido.s_descripcion          || '';
        this.n_precio               = servicioSugerido.n_precio               || 0;
        this.n_duracion_horas       = servicioSugerido.n_duracion_horas       || 0;
        this.refacciones            = servicioSugerido.refacciones            || [];
    }

    public getRandomID(): number {
        const S4 = () => {
        return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    }
}
