import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

/** Evita volver al login cuando ya hay sesión activa. */
export const loggedInGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.sesion) {
    return router.createUrlTree(['/dashboard/main']);
  }

  return true;
};

/** @deprecated Alias para rutas legadas; usar loggedInGuard. */
export { loggedInGuard as LoggedInAuthGuard };
