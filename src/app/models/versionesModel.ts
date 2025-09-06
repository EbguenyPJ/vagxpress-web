import { formatDate } from '@angular/common';

export class versionesModel {
    id_version:                     number;
    id_usuario:                     number;
    s_nombre_usuario:               string;
    s_apellido_paterno_usuario:     string;
    s_apellido_materno_usuario:     string;
    s_nombre_version:               string;
    s_descripcion_version:          string;
    d_fecha_actualizacion_version:  string;
    b_activo:                       number;

    constructor(versionesModel: Partial<versionesModel> = {}) {
        this.id_version                     = versionesModel.id_version                     || this.getRandomID();
        this.id_usuario                     = versionesModel.id_usuario                     !;
        this.s_nombre_usuario               = versionesModel.s_nombre_usuario               !;
        this.s_apellido_paterno_usuario     = versionesModel.s_apellido_paterno_usuario     !;
        this.s_apellido_materno_usuario     = versionesModel.s_apellido_materno_usuario     !; 
        this.s_nombre_version               = versionesModel.s_nombre_version               !; 
        this.s_descripcion_version          = versionesModel.s_descripcion_version          !;
        this.d_fecha_actualizacion_version  = versionesModel.d_fecha_actualizacion_version  !;
        this.b_activo                       = versionesModel.b_activo                       !; 

    }

    public getRandomID(): number {
        const S4 = () => {
        return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    } 
}