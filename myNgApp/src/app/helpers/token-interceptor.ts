import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http"; import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()
export class tokenInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authService = this.injector.get(AuthService)
        let tokenizedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authService.getToken()}`
            }
        })
        return next.handle(tokenizedReq)
    }
}
