import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { Observable, of, map, from, switchMap, catchError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(
        private loginService: LoginService,
        private tokenService: TokenService,
        private userService: UserService,
        private router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const ott = route.queryParams['ott'];
        if (ott && !this.tokenService.isTokenValid()) {
            return this.handleCrossAuth(ott);
        }

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

    private handleCrossAuth(ott: string): Observable<boolean> {
        return this.loginService.crossAuth(ott).pipe(
            map((response: any) => {
                if (response && response.user && response.token) {
                    this.userService.setDataUser(response.user);
                    this.tokenService.setDataToken(response.token);
                    return true;
                }
                this.handleUnauthorized();
                return false;
            }),
            catchError(() => {
                this.handleUnauthorized();
                return of(false);
            }),
        );
    }

    private handleUnauthorized(): void {
        this.router.navigate(['/logout']);
    }
}
