export class OrdenesServicioTecnicosModel {
  id_orden_servicio_tecnico:       number;
  d_fecha_hora_asignacion:         string;
  id_empleado:                     number;
  s_nombre:                        string;
  s_apellido_paterno:              string;
  s_apellido_materno:              string;
  s_foto_empleado:                 string;
  id_orden_servicio:               number;
  id_estatus_orden_servicio:       number;
  s_estatus_orden_servicio:        string;
  b_activo:                        number;
  id_estatus_proceso:              number;
  s_estatus_proceso:               string;


    constructor(OrdenesServicioTecnicosModel: Partial<OrdenesServicioTecnicosModel> = {}) {
        this.id_orden_servicio_tecnico  = OrdenesServicioTecnicosModel.id_orden_servicio_tecnico            || this.getRandomID();
        this.d_fecha_hora_asignacion    = OrdenesServicioTecnicosModel.d_fecha_hora_asignacion              !;
        this.id_empleado                = OrdenesServicioTecnicosModel.id_empleado                          !;
        this.s_nombre                   = OrdenesServicioTecnicosModel.s_nombre                             !;
        this.s_apellido_paterno         = OrdenesServicioTecnicosModel.s_apellido_paterno                   !;
        this.s_apellido_materno         = OrdenesServicioTecnicosModel.s_apellido_materno                   !;
        this.s_foto_empleado            = OrdenesServicioTecnicosModel.s_foto_empleado                      !;
        this.id_orden_servicio          = OrdenesServicioTecnicosModel.id_orden_servicio                    !;
        this.id_estatus_orden_servicio  = OrdenesServicioTecnicosModel.id_estatus_orden_servicio            !;
        this.s_estatus_orden_servicio   = OrdenesServicioTecnicosModel.s_estatus_orden_servicio             !;
        this.b_activo                   = OrdenesServicioTecnicosModel.b_activo                             !;
        this.id_estatus_proceso         = OrdenesServicioTecnicosModel.id_estatus_proceso                   !;
        this.s_estatus_proceso          = OrdenesServicioTecnicosModel.s_estatus_proceso                    !;


    }

    public getRandomID(): number {
        const S4 = () => {
        return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    } 
}