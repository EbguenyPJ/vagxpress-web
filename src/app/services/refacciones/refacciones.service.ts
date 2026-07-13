import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { FilaCatalogo, Proveedor, RefaccionDetalle, RefaccionListado } from '@core/models/dominio';
import { ApiBase } from '../api-base';

export interface ReglaCompatibilidadPayload {
  id_marcas?: number[];
  id_modelos?: number[];
  id_generaciones?: number[];
  id_motores?: number[];
  s_resumen?: string | null;
}

export interface GuardarRefaccionPayload {
  s_nombre_refaccion: string;
  s_numero_parte?: string | null;
  s_imagen_refaccion?: string | null;
  n_precio_compra?: number;
  n_precio_venta?: number;
  n_precio_mayoreo?: number;
  n_stock_actual?: number;
  id_marca_refaccion?: number | null;
  id_unidad_medida?: number | null;
  id_proveedor?: number | null;
  id_clase_refaccion?: number | null;
  id_categoria_refaccion?: number | null;
  id_subcategoria_refaccion?: number | null;
  id_posicion_vehiculo?: number | null;
  id_ubicacion_almacen?: number | null;
  b_importado?: 0 | 1;
  refacciones_equivalentes?: number[] | { id_refaccion: number }[];
  reglas_compatibilidad?: ReglaCompatibilidadPayload[];
}

export interface RefaccionMasivaPayload {
  s_nombre_refaccion: string;
  s_numero_parte: string;
  id_marca_refaccion: number;
  id_categoria_refaccion: number;
  id_subcategoria_refaccion: number;
}

@Injectable({ providedIn: 'root' })
export class RefaccionesService extends ApiBase {
  getRefacciones(): Observable<ApiResponse<RefaccionListado[]>> {
    return this.http.get<ApiResponse<RefaccionListado[]>>(`${this.apiUrl}/refacciones`);
  }

  getRefaccionById(idRefaccion: number): Observable<ApiResponse<RefaccionDetalle>> {
    return this.http.get<ApiResponse<RefaccionDetalle>>(`${this.apiUrl}/refacciones/${idRefaccion}`);
  }

  crearRefaccion(payload: GuardarRefaccionPayload): Observable<ApiResponse<RefaccionDetalle>> {
    return this.http.post<ApiResponse<RefaccionDetalle>>(`${this.apiUrl}/refacciones`, payload);
  }

  editarRefaccion(idRefaccion: number, payload: GuardarRefaccionPayload): Observable<ApiResponse<RefaccionDetalle>> {
    return this.http.put<ApiResponse<RefaccionDetalle>>(`${this.apiUrl}/refacciones/${idRefaccion}`, payload);
  }

  crearRefaccionesMasivo(refacciones: RefaccionMasivaPayload[]): Observable<ApiResponse<RefaccionDetalle[]>> {
    return this.http.post<ApiResponse<RefaccionDetalle[]>>(`${this.apiUrl}/refacciones/masivo`, { refacciones });
  }

  // ── Catálogos que consumen los diálogos de alta/edición ──────────────

  getMarcas(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.catalogo('marcas-refacciones');
  }

  getCategorias(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.catalogo('categorias-refacciones');
  }

  getSubcategorias(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.catalogo('subcategorias-refacciones');
  }

  getClases(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.catalogo('clases-refacciones');
  }

  getUnidadesMedida(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.catalogo('unidades-medida');
  }

  getPosicionesVehiculo(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.catalogo('posiciones-vehiculo');
  }

  getUbicacionesAlmacen(): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.catalogo('ubicaciones-almacen');
  }

  getProveedores(): Observable<ApiResponse<Proveedor[]>> {
    return this.http.get<ApiResponse<Proveedor[]>>(`${this.apiUrl}/proveedores`);
  }

  private catalogo(slug: string): Observable<ApiResponse<FilaCatalogo[]>> {
    return this.http.get<ApiResponse<FilaCatalogo[]>>(`${this.apiUrl}/catalogos/${slug}`);
  }
}
