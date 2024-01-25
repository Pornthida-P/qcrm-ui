import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, concatMap, from } from 'rxjs';
import { TokenService } from 'src/app/services/token/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenServices: TokenService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenServices.getDataToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        return next.handle(request);
    }
}
