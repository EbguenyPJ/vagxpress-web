import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { Sesion } from '../models/sesion';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sesionSubject: BehaviorSubject<Sesion | null>;
  readonly sesion$: Observable<Sesion | null>;

  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {
    this.sesionSubject = new BehaviorSubject<Sesion | null>(this.storage.obtenerSesion());
    this.sesion$ = this.sesionSubject.asObservable();
  }

  /** Sesión actual (null si no hay usuario autenticado). */
  get sesion(): Sesion | null {
    return this.sesionSubject.value;
  }

  /** @deprecated Compatibilidad con guards/plantilla legados; usar `sesion`. */
  get currentUserValue(): Sesion | null {
    return this.sesion;
  }

  login(name: string, password: string): Observable<ApiResponse<Sesion>> {
    return this.http
      .post<ApiResponse<Sesion>>(`${environment.apiUrl}/auth/login`, { name, password })
      .pipe(tap((respuesta) => {
        this.storage.guardarSesion(respuesta.data);
        this.sesionSubject.next(respuesta.data);
      }));
  }

  /** Cierra la sesión local; la revocación del token en el API es best-effort. */
  logout(): void {
    const token = this.storage.obtenerToken();
    if (token) {
      this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({ error: () => undefined });
    }

    this.storage.limpiarSesion();
    this.sesionSubject.next(null);
  }
}
