import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/User';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _loginUrl = 'http://localhost:3000/user/login';
  _registerUrl = 'http://localhost:3000/user/signup';

  constructor(private _http: HttpClient, private _router: Router) { }

  registerUser(user: User) {
    return this._http.post<any>(this._registerUrl, user)
      .pipe(catchError(this.errorHandler))
  }

  loginUser(user: User) {
    return this._http.post<any>(this._loginUrl, user)
    .pipe(catchError(this.errorHandler))
  }

  loggedIn(){
    return !!localStorage.getItem('token')
  } 

  getToken() {
    return localStorage.getItem('token')
  }

  logoutUser() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    location.reload();
    this._router.navigate([''])
  }

  getRole() {
    return localStorage.getItem('role')
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
