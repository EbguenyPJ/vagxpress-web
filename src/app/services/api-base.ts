import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Base común de los servicios de dominio: HttpClient + URL del API.
 * El token lo añade JwtInterceptor; los servicios no manejan headers.
 */
export abstract class ApiBase {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;
}
