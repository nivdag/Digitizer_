import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersListService {
  
  errorMsg = '';
  _url_my_orders = 'http://localhost:3000/documents/myorders';
  _url_all_open_orders = 'http://localhost:3000/documents';

  constructor(private _http: HttpClient) { }

  getAllDocuments() {
    return this._http.get<any>(this._url_my_orders)
      .pipe(catchError(this.errorHandler))
  }

  getOpenOrders() {
    return this._http.get<any>(this._url_all_open_orders)
      .pipe(catchError(this.errorHandler))
  }
  

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
