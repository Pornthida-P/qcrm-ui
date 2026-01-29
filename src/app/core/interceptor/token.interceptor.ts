import { Injectable, NgZone } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private tokenServices: TokenService,
        private userService: UserService,
        private router: Router,
        private ngZone: NgZone,
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenServices.getDataToken();
        const isQimApi = request.url.startsWith(environment.api.urlQIM);
        const isLogoutRequest = request.url.includes('/logout');
        const isAuditLogRequest = request.url.includes('/audit-log');
        const isVocabsRequest = request.url.includes('/vocabs');
        const isLoginRequest = request.url.includes('/login');
        const isCrossAuthRequest = request.url.includes('/cross-auth');
        const shouldSkipTokenCheck = isLogoutRequest || isAuditLogRequest || isVocabsRequest || isLoginRequest || isCrossAuthRequest;

        // Skip token expiry check in interceptor - let server handle it
        // Only check when server returns 401/403 to avoid premature redirects

        // Add token to request if available; skip for login/cross-auth (they use Basic/OTT, not Bearer)
        if (token && !isQimApi && !isCrossAuthRequest && !isLoginRequest) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if ((error.status === 401 || error.status === 403) && !shouldSkipTokenCheck) {
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
