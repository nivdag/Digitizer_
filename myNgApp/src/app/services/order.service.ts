import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  _url = 'http://localhost:3000/documents';
  _urlOrder = 'http://localhost:3000/orders';


  constructor(private _http: HttpClient) { }

  order(fd: FormData) {
    return this._http.post<any>(this._url, fd)
      .pipe(catchError(this.errorHandler))
  }

  uploadResult(fd: FormData) {
    return this._http.post<any>(this._urlOrder + '/result', fd)
     .pipe(catchError(this.errorHandler))
  }

  updateEmp(fileId: String) {
    var body = { fId: fileId };
    return this._http.patch(this._url + '/' + 'update/' + fileId, body)
      .pipe(catchError(this.errorHandler))
  }

  updateDocument(fileId: String, body) {
    var bodyToSend = body;
    return this._http.patch(this._url + '/' + fileId, bodyToSend)
      .pipe(catchError(this.errorHandler))
  }

  deleteDocument(fileId: String) {
    return this._http.delete(this._url + '/' + fileId)
      .pipe(catchError(this.errorHandler))
  }

  getWorkSpace() {
    return this._http.get('http://localhost:3000/orders/workspace')
      .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

}
