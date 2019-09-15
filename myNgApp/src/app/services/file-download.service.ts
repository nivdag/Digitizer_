import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  _urlDoc = 'http://localhost:3000/documents/download/';
  _urlOcr = 'http://localhost:3000/documents/ocr/download/';
  _urlResult = 'http://localhost:3000/documents/result/download/';
  

  constructor(private _http: HttpClient) { }

  downloadFile(fileId: String) {
    var body = { fId: fileId };

    console.log(this._urlDoc + fileId)
    return this._http.post(this._urlDoc + fileId, body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  downloadOcr(fileId: String) {
    var body = { fId: fileId };

    console.log(this._urlOcr + fileId)
    return this._http.post(this._urlOcr + fileId, body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  downloadResult(fileId: String) {
    var body = { fId: fileId };

    console.log(this._urlResult + fileId)
    return this._http.post(this._urlResult + fileId, body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
