import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { conexion } from 'app/conexion';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  // private users = [
  //   {
  //     id: 1,
  //     username: 'admin',
  //     password: 'admin',
  //     firstName: 'Sarah',
  //     lastName: 'Smith',
  //     token: 'admin-token',
  //   },
  // ];

  constructor(private http: HttpClient)
  {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User
  {
    return this.currentUserSubject.value;
  }


  // login(username: string, password: string)
  // {
  //   const user = this.users.find((u) => u.username === username && u.password === password);
  //   console.log("Datos del usuario logueado: ", user);

  //   if (!user)//Si el usuario o la contrasela no coinciden
  //   {
  //     return this.error('El usuario o la contraseña son incorrectos');
  //   }
  //   else
  //   {
  //     localStorage.setItem('currentUser', JSON.stringify(user));
  //     this.currentUserSubject.next(user);

  //     console.log("El currente user: ", this.currentUserSubject.next(user));

  //     return this.ok({
  //       id: user.id,
  //       username: user.username,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       token: user.token,
  //     });
  //   }
  // }






  login(s_token:string, data: any)
  {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json; multipart/form-data',
        'Token': s_token
     });

    let url = conexion.url + 'login'
    let options = { headers: headers };
    return this.http.post(url, data, options);
  }



  // ok(body?: {
  //   id: number;
  //   username: string;
  //   firstName: string;
  //   lastName: string;
  //   token: string;
  // }) {
  //   return of(new HttpResponse({ status: 200, body }));
  // }

  // error(message: string)
  // {
  //   return throwError(message);
  // }

  logout()
  {
    // Eliminar usuario del Local Storage al cerrar sesión
    localStorage.removeItem('currentUser');
    localStorage.removeItem('id_sucursal');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }



}
