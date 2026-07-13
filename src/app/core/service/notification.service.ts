import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

/**
 * Envoltura de SweetAlert2 con los estilos que ya usa la app
 * (toasts arriba a la derecha, modal de confirmación estándar).
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  exito(titulo: string, timer = 1500): void {
    this.toast('success', titulo, timer);
  }

  error(titulo: string, timer = 2500): void {
    this.toast('error', titulo, timer);
  }

  advertencia(titulo: string, timer = 2500): void {
    this.toast('warning', titulo, timer);
  }

  /** Toast oscuro usado en el login. */
  toastOscuro(icono: SweetAlertIcon, titulo: string, timer = 2500): void {
    Swal.fire({
      toast: true,
      icon: icono,
      title: titulo,
      position: 'top-end',
      showConfirmButton: false,
      timer,
      background: '#1A1A1A',
      color: '#fff',
    });
  }

  /** Confirmación con botones Sí/Cancelar; resuelve true si el usuario confirma. */
  async confirmar(titulo: string, texto: string, textoConfirmar = 'Sí, continuar'): Promise<boolean> {
    const resultado = await Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: textoConfirmar,
      cancelButtonText: 'Cancelar',
    });

    return resultado.isConfirmed === true;
  }

  private toast(icono: SweetAlertIcon, titulo: string, timer: number): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icono,
      title: titulo,
      showConfirmButton: false,
      timer,
    });
  }
}
