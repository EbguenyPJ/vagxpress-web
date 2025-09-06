export class llamadasCalidadModel {
    id_llamada_calidad:         number;
    id_orden_servicio_origen:   number;
    id_estatus_llamada_calidad: number;
    s_estatus_llamada_calidad:  string;
    id_usuario_seguimiento:     number;
    s_nombre_usuario:           string;
    s_apellido_paterno_usuario: string;
    s_apellido_materno_usuario: string;
    id_calificacion:            number;
    n_calificacion:             number;
    id_tipo_recomendacion:      number;
    s_recomendacion:            string;
    s_comentario:               string;
    d_fecha_llamada:            string;
    b_activo:                   number;
    id_cliente:                 number;
    s_nombre_cliente:           string;
    s_apellido_paterno_cliente: string;
    s_apellido_materno_cliente: string;
    n_telefono?:                 string;
    servicios_pendientes?:       string;
    id_orden_servicio?:         number;

    constructor(llamadasCalidadModel: Partial<llamadasCalidadModel> = {}) {
        this.id_llamada_calidad            = llamadasCalidadModel.id_llamada_calidad            || this.getRandomID();
        this.id_orden_servicio_origen      = llamadasCalidadModel.id_orden_servicio_origen      !;
        this.id_estatus_llamada_calidad    = llamadasCalidadModel.id_estatus_llamada_calidad    !;
        this.s_estatus_llamada_calidad     = llamadasCalidadModel.s_estatus_llamada_calidad     !; 
        this.id_usuario_seguimiento        = llamadasCalidadModel.id_usuario_seguimiento        !;
        this.s_nombre_usuario              = llamadasCalidadModel.s_nombre_usuario              !; 
        this.s_apellido_paterno_usuario    = llamadasCalidadModel.s_apellido_paterno_usuario    !; 
        this.s_apellido_materno_usuario    = llamadasCalidadModel.s_apellido_materno_usuario    !; 
        this.id_calificacion               = llamadasCalidadModel.id_calificacion               !;
        this.n_calificacion                = llamadasCalidadModel.n_calificacion                !;
        this.id_tipo_recomendacion         = llamadasCalidadModel.id_tipo_recomendacion         !;
        this.s_recomendacion               = llamadasCalidadModel.s_recomendacion               !;
        this.s_comentario                  = llamadasCalidadModel.s_comentario                  !;
        this.d_fecha_llamada               = llamadasCalidadModel.d_fecha_llamada               !;
        this.b_activo                      = llamadasCalidadModel.b_activo                      !;
        this.id_cliente                    = llamadasCalidadModel.id_cliente                    !;
        this.s_nombre_cliente              = llamadasCalidadModel.s_nombre_cliente              !;
        this.s_apellido_paterno_cliente    = llamadasCalidadModel.s_apellido_paterno_cliente    !;
        this.s_apellido_materno_cliente    = llamadasCalidadModel.s_apellido_materno_cliente    !;
        this.n_telefono                    = llamadasCalidadModel.n_telefono                    !;
        this.servicios_pendientes          = llamadasCalidadModel.servicios_pendientes          !;
        this.id_orden_servicio             = llamadasCalidadModel.id_orden_servicio             !;
    }

    public getRandomID(): number {
        const S4 = () => {
            return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    } 
}