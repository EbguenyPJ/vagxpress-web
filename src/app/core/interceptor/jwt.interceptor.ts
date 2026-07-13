import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../service/storage.service';

/** Única fuente del header Authorization: token Sanctum en peticiones al API. */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private readonly storage: StorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.storage.obtenerToken();

    if (token && request.url.startsWith(environment.apiUrl)) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request);
  }
}
