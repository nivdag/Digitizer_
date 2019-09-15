import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuickOcrService {

  _url = 'http://localhost:3000/documents/free';

  constructor(private _http: HttpClient) { }

  quickOcr(doc) {
    return this._http.post<any>(this._url, doc)
      .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

}
