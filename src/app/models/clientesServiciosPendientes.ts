import { formatDate } from '@angular/common';

export class clientesServiciosPendientesModel {
    id_cliente:                 number;
    s_nombre_cliente:           string;
    s_apellido_paterno_cliente: string;
    s_apellido_materno_cliente: string;
    n_telefono:                 string;
    servicios_pendientes:       string;

  
    constructor(clientesServiciosPendientesModel: Partial<clientesServiciosPendientesModel> = {}) {
      this.id_cliente                   = clientesServiciosPendientesModel.id_cliente                 || this.getRandomID();      
      this.s_nombre_cliente             = clientesServiciosPendientesModel.s_nombre_cliente           !;           
      this.s_apellido_paterno_cliente   = clientesServiciosPendientesModel.s_apellido_paterno_cliente !;
      this.s_apellido_materno_cliente   = clientesServiciosPendientesModel.s_apellido_materno_cliente !;
      this.n_telefono                   = clientesServiciosPendientesModel.n_telefono                 !;
      this.servicios_pendientes         = clientesServiciosPendientesModel.servicios_pendientes       !;
    }
  
    public getRandomID(): number {
      const S4 = () => {
        return ((1 + Math.random()) * 0x10000) | 0;
      };
      return S4() + S4();
    } 
}