import { Injectable } from '@angular/core';
import { Sesion } from '../models/sesion';

/**
 * Único punto de acceso a localStorage para la sesión.
 * Mantiene las claves legadas (id_usuario, id_sucursal…) que el layout
 * de la plantilla lee directamente.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private static readonly SESION = 'currentUser';

  guardarSesion(sesion: Sesion): void {
    localStorage.setItem(StorageService.SESION, JSON.stringify(sesion));
    localStorage.setItem('token', sesion.token);
    localStorage.setItem('id_usuario', String(sesion.id_usuario));
    localStorage.setItem('username', sesion.username);
    localStorage.setItem('id_empleado', String(sesion.id_empleado));
    localStorage.setItem('id_sucursal', String(sesion.id_sucursal ?? ''));
  }

  obtenerSesion(): Sesion | null {
    const crudo = localStorage.getItem(StorageService.SESION);
    if (!crudo) {
      return null;
    }

    try {
      return JSON.parse(crudo) as Sesion;
    } catch {
      this.limpiarSesion();
      return null;
    }
  }

  obtenerToken(): string | null {
    return this.obtenerSesion()?.token ?? null;
  }

  limpiarSesion(): void {
    ['currentUser', 'token', 'id_usuario', 'username', 'id_empleado', 'id_sucursal']
      .forEach((clave) => localStorage.removeItem(clave));
  }
}
