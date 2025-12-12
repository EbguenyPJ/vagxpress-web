import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { CommonModule } from '@angular/common';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Services
import { VersionesService } from 'app/services/versiones/versiones.service';

// Animations
import Swal from "sweetalert2";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ]
})
export class SigninComponent implements OnInit {

  name: string = "";
  password: string = "";
  errorMsg: string = "";
  loading: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private versionesSrv: VersionesService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem("token");
  }

  // ================================================
  //                 LOGIN PRINCIPAL
  // ================================================
  login() {

    this.errorMsg = "";
    this.loading = true;

    const payload = {
      name: this.name,
      password: this.password
    };

    this.auth.login("", payload).subscribe({

      next: (res: any) => {

        this.loading = false;
        console.log("Respuesta login:", res);

        // ===============================
        // ERRORES 401 DE BACKEND
        // ===============================
        if (res.code === 401) {

          this.errorMsg = res.message;

          Swal.fire({
            toast: true,
            icon: 'error',
            title: res.message,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
            background: '#1A1A1A',
            color: '#fff'
          });

          return;
        }

        // ===============================
        // VALIDACIÓN DE RESPUESTA
        // ===============================
        if (!res || res.code !== 201) {

          this.errorMsg = "Usuario o contraseña incorrectos";

          Swal.fire({
            toast: true,
            icon: 'error',
            title: 'Usuario o contraseña incorrectos',
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
            background: '#1A1A1A',
            color: '#fff'
          });

          return;
        }

        // ===============================
        // LOGIN EXITOSO (201)
        // ===============================

        // Guardar usuario completo (compatibilidad con módulos)
        localStorage.setItem("currentUser", JSON.stringify(res));

        // Guardar campos individuales
        localStorage.setItem("token", res.token);
        localStorage.setItem("id_sucursal", res.id_sucursal);
        localStorage.setItem("id_usuario", res.id_usuario);
        localStorage.setItem("username", res.username);
        localStorage.setItem("id_empleado", res.id_empleado);

        // Toast de bienvenida
        Swal.fire({
          toast: true,
          icon: 'success',
          title: '¡Bienvenido!',
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          background: '#1A1A1A',
          color: '#fff'
        });

        // Redirección
        this.router.navigate(['/dashboard/main']);
      },

      // ===============================
      // ERROR DE SERVIDOR
      // ===============================
      error: (err) => {
        this.loading = false;
        this.errorMsg = "Error de conexión con el servidor.";

        Swal.fire({
          toast: true,
          icon: 'warning',
          title: 'Error de conexión con el servidor',
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          background: '#1A1A1A',
          color: '#fff'
        });
      }

    });
  }

} // End class
