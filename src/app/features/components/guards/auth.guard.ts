// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.loginService.isLogined().pipe(
            tap((isLogined) => {
                if (!isLogined) {
                    this.router.navigate(['/login']);
                }
            }),
        );
    }
}
