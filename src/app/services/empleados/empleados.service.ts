import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { Empleado, HabilidadEmpleado } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export type GuardarEmpleadoPayload = Partial<Empleado> & { s_foto_empleado?: string | null };

@Injectable({ providedIn: 'root' })
export class EmpleadosService extends ApiBase {
  getEmpleados(): Observable<ApiResponse<Empleado[]>> {
    return this.http.get<ApiResponse<Empleado[]>>(`${this.apiUrl}/empleados`);
  }

  getEmpleadosSinUsuario(): Observable<ApiResponse<Empleado[]>> {
    return this.http.get<ApiResponse<Empleado[]>>(`${this.apiUrl}/empleados/sin-usuario`);
  }

  getEmpleadoPorUsuario(idUsuario: number): Observable<ApiResponse<Empleado>> {
    return this.http.get<ApiResponse<Empleado>>(`${this.apiUrl}/empleados/usuario/${idUsuario}`);
  }

  getEmpleadosPorSucursal(idSucursal: number): Observable<ApiResponse<Empleado[]>> {
    return this.http.get<ApiResponse<Empleado[]>>(`${this.apiUrl}/empleados/sucursal/${idSucursal}`);
  }

  getGerenteSucursal(idSucursal: number): Observable<ApiResponse<Empleado>> {
    return this.http.get<ApiResponse<Empleado>>(`${this.apiUrl}/empleados/sucursal/${idSucursal}/gerente`);
  }

  crearEmpleado(payload: GuardarEmpleadoPayload): Observable<ApiResponse<Empleado>> {
    return this.http.post<ApiResponse<Empleado>>(`${this.apiUrl}/empleados`, payload);
  }

  actualizarEmpleado(idEmpleado: number, payload: GuardarEmpleadoPayload): Observable<ApiResponse<Empleado>> {
    return this.http.put<ApiResponse<Empleado>>(`${this.apiUrl}/empleados/${idEmpleado}`, payload);
  }

  getHabilidades(idEmpleado: number): Observable<ApiResponse<HabilidadEmpleado[]>> {
    return this.http.get<ApiResponse<HabilidadEmpleado[]>>(`${this.apiUrl}/empleados/${idEmpleado}/habilidades`);
  }

  actualizarHabilidades(idEmpleado: number, habilidades: Pick<HabilidadEmpleado, 'id_habilidad_empleado' | 'id_habilidad' | 'n_nivel_dominio'>[]): Observable<ApiResponse<HabilidadEmpleado[]>> {
    return this.http.put<ApiResponse<HabilidadEmpleado[]>>(`${this.apiUrl}/empleados/${idEmpleado}/habilidades`, { habilidades });
  }
}
