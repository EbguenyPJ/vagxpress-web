import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

/** Bloquea las rutas de la app si no hay sesión. */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.sesion) {
    return true;
  }

  return router.createUrlTree(['/authentication/signin']);
};

/** @deprecated Alias de clase para rutas legadas; usar authGuard. */
export { authGuard as AuthGuard };
