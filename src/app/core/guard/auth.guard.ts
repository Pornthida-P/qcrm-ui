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

        // ถ้ามี OTT → ตรวจสอบและ cross-auth ถ้า user ต่างกัน
        if (ott) {
            return this.handleCrossAuthWithCheck(ott);
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

    private handleCrossAuthWithCheck(ott: string): Observable<boolean> {
        return this.loginService.crossAuth(ott).pipe(
            map((response: any) => {
                if (response && response.user && response.token) {
                    // ดึง user ปัจจุบัน
                    const currentUserData = localStorage.getItem('userData');
                    const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

                    // ถ้า user ต่างกัน หรือยังไม่ได้ login → update user และ token
                    if (!currentUser || currentUser.username !== response.user.username) {
                        this.userService.setDataUser(response.user);
                        this.tokenService.setDataToken(response.token);
                    }
                    // ถ้า user เดียวกัน → ใช้ต่อได้เลย (ไม่ต้อง update)

                    return true;
                }
                this.handleUnauthorized();
                return false;
            }),
            catchError(() => {
                // ถ้า cross-auth ล้มเหลว แต่มี token อยู่แล้ว → ใช้ต่อ
                if (this.tokenService.isTokenValid()) {
                    return of(true);
                }
                this.handleUnauthorized();
                return of(false);
            }),
        );
    }

    private handleUnauthorized(): void {
        this.router.navigate(['/logout']);
    }
}
