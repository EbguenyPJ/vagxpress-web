import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService, NotificationService, StorageService } from '@core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class SigninComponent implements OnInit {
  name = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly storage: StorageService,
    private readonly notificaciones: NotificationService,
  ) {}

  ngOnInit(): void {
    // Entrar al login siempre parte de una sesión limpia.
    this.storage.limpiarSesion();
  }

  login(): void {
    this.errorMsg = '';
    this.loading = true;

    this.auth.login(this.name, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.notificaciones.toastOscuro('success', '¡Bienvenido!', 1500);
        this.router.navigate(['/dashboard/main']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        if (error.status === 401 || error.status === 422) {
          this.errorMsg = error.error?.message ?? 'Usuario o contraseña incorrectos';
          this.notificaciones.toastOscuro('error', this.errorMsg);
          return;
        }

        this.errorMsg = 'Error de conexión con el servidor.';
        this.notificaciones.toastOscuro('warning', 'Error de conexión con el servidor');
      },
    });
  }
}
