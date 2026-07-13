import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';

/**
 * Manejo central de errores HTTP: un 401 cierra la sesión y regresa al
 * login; el resto se propaga con el HttpErrorResponse completo para que
 * cada pantalla decida (422 pinta errores de formulario, 5xx notifica).
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !request.url.endsWith('/auth/login')) {
          this.authService.logout();
          this.router.navigate(['/authentication/signin']);
        }

        return throwError(() => error);
      }),
    );
  }
}
