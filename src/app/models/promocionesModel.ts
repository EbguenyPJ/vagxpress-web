import { formatDate } from '@angular/common';

export class promocionesModel {
    id_promocion:               number;
    s_promocion:                string;
    s_nota:                     string;
    n_porcentaje_descuento:     number;
    d_fecha_inicio:             string;
    d_fecha_fin:                string;
    b_activo:                   number;
    b_promo_fija:               number;
    b_cierre_automatico:        number;
    id_imagen:                  string;
    id_forma_pago:              number;
    s_forma_pago:               string;
    id_usuario_crea:            number;
    s_nombre_usuario:           string;
    s_apellido_paterno_usuario: string;
    s_apellido_materno_usuario: string;
    d_fecha_registro:           string;
    id_tipo_promocion:          number;
    n_descuento:                number;


    constructor(promocionesModel: Partial<promocionesModel> = {}) {
        this.id_promocion               = promocionesModel.id_promocion                     || this.getRandomID();
        this.s_promocion                = promocionesModel.s_promocion                      !; 
        this.s_nota                     = promocionesModel.s_nota                           !; 
        this.n_porcentaje_descuento     = promocionesModel.n_porcentaje_descuento           !; 
        this.d_fecha_inicio             = promocionesModel.d_fecha_inicio                   !; 
        this.d_fecha_fin                = promocionesModel.d_fecha_fin                      !; 
        this.b_activo                   = promocionesModel.b_activo                         !;
        this.b_promo_fija               = promocionesModel.b_promo_fija                     !; 
        this.b_cierre_automatico        = promocionesModel.b_cierre_automatico              !; 
        this.id_imagen                  = promocionesModel.id_imagen                        !;
        this.id_forma_pago              = promocionesModel.id_forma_pago                    !; 
        this.s_forma_pago               = promocionesModel.s_forma_pago                     !;
        this.id_usuario_crea            = promocionesModel.id_usuario_crea                  !;
        this.s_nombre_usuario           = promocionesModel.s_nombre_usuario                 !;
        this.s_apellido_paterno_usuario = promocionesModel.s_apellido_paterno_usuario       !;
        this.s_apellido_materno_usuario = promocionesModel.s_apellido_materno_usuario       !; 
        this.d_fecha_registro           = promocionesModel.d_fecha_registro                 !;  
        this.id_tipo_promocion          = promocionesModel.id_tipo_promocion                !;  
        this.n_descuento                = promocionesModel.n_descuento                      !; 
    }

    public getRandomID(): number {
        const S4 = () => {
        return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    } 
}