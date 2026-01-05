import { Injectable, NgZone } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token/token.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenServices: TokenService, private router: Router, private ngZone: NgZone) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenServices.getDataToken();
        const isQimApi = request.url.startsWith(environment.api.urlQIM);
        const isLogoutRequest = request.url.includes('/logout');

        // Skip token expiry check for logout requests to prevent infinite loop
        if (token && this.tokenServices.isTokenExpired() && !isLogoutRequest) {
            this.handleAuthError();
            return throwError(() => new Error('Token expired'));
        }

        if (token && !isQimApi) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if ((error.status === 401 || error.status === 403) && !isLogoutRequest) {
                    this.handleAuthError();
                }
                return throwError(() => error);
            }),
        );
    }

    private handleAuthError(): void {
        this.ngZone.run(() => {
            this.router.navigate(['/logout']);
        });
    }
}
