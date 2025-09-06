import { Message } from './../../shared/components/chat-widget/chat-widget.component';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    ]
})

export class SigninComponent implements OnInit
{
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  returnUrl!: string;
  error = '';
  hide = true;
  dataResponse : any;
  ultimaVersionGeneral: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    public VersionesService: VersionesService,
  ) {}

  ngOnInit()
  {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.getUltimaVersion();
  }

  async getUltimaVersion() {
    this.VersionesService.getUltimaVersion("").subscribe(
      (respuesta: any) => {
        const data = respuesta?.data;
        if (Array.isArray(data) && data.length > 0) {
          this.ultimaVersionGeneral = data[0];
          console.log("ultima version: ", this.ultimaVersionGeneral);
        } else {
          Swal.fire('Advertencia', 'No se encontró ninguna versión registrada', 'warning');
        }
      },
      error => {
        Swal.fire('Error', 'No se pudo cargar la última versión', 'error');
      }
    );
  }

  get f(){
    return this.authForm.controls;
  }

  onSubmit()
  {
    this.submitted = true;
    this.error = '';

    if (this.authForm.invalid)
    {
      this.error = 'Username and Password not valid !';
      return;
    }
      else
          {
            let dataLogin : any =
              {
                  "name": this.f['username'].value,
                  "password" : this.f['password'].value
              }

            //this.authService.login(this.f['username'].value, this.f['password'].value).subscribe
            this.authService.login("", dataLogin).subscribe
            ({ next: (res) =>
              {
                this.dataResponse = res;
                console.log("Respuesta del servisio: ", this.dataResponse );
                console.log("Id sucursal: ", this.dataResponse.id_sucursal);


                if(this.dataResponse.code == 401){
                  this.error = this.dataResponse.message;
                }

                if(this.dataResponse == null || this.dataResponse.code != 200 || this.dataResponse == undefined ){
                  this.error = "Usuario incorrecto";
                }

                  if (this.dataResponse.code == 201)
                  {
                    const token = this.dataResponse.token;
                    //console.log("El token del servicio: ", token);
                    localStorage.setItem('currentUser', JSON.stringify(res));
                    localStorage.setItem('id_sucursal', this.dataResponse.id_sucursal);

                    if (token)
                    {
                      this.router.navigate(['/dashboard/main']);
                    }
                  }
                  else {
                    this.error = 'Acceso no valido';
                  }

              },

              error: (error) => {
                this.error = error;
                this.submitted = false;
                this.loading = false;
              },
            });
          }
  }//End onSubmit

  onSignupClick(event: Event): void {
  event.preventDefault();

  Swal.fire({
    title: 'Solicutud Enviada',
    text: 'Un administrador atenderá tu solicitud lo mas pronto posible.',
    icon: 'success',
    confirmButtonText: 'Aceptar',
    timer: 3000
  });
}

}//End class
