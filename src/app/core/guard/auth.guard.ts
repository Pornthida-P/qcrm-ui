import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { TokenService } from 'src/app/services/token/token.service';
import { Observable, of, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(private loginService: LoginService, private tokenService: TokenService, private router: Router) {}

    canActivate(): Observable<boolean> {
        if (!this.tokenService.isTokenValid()) {
            this.handleUnauthorized();
            return of(false);
        }

        const userData = localStorage.getItem('userData');
        if (!userData) {
            this.handleUnauthorized();
            return of(false);
        }

        return this.loginService.isLogined().pipe(
            map((isLogined) => {
                if (!isLogined) {
                    this.handleUnauthorized();
                    return false;
                }
                return true;
            }),
        );
    }

    private handleUnauthorized(): void {
        this.router.navigate(['/logout']);
    }
}
