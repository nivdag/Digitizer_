import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/User';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  _url = 'http://localhost:3000/user/login';

  constructor(private _http: HttpClient) { }

    log(user: User) {
      return this._http.post<any>(this._url, user)
      .pipe(catchError(this.errorHandler))
    }

    errorHandler(error: HttpErrorResponse) {
      return throwError(error);
    }
  
}
