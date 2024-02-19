import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit {
    userData?: User | null;

    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private loginService: LoginService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.getUserData();
        this.logout();
    }

    getUserData() {
        this.userService
            .getDataUser()
            .pipe(
                tap((res: User | null) => {
                    this.userData = res;
                }),
            )
            .subscribe(() => {});
    }

    async logout() {
        this.userService.clearDataUser();
        this.tokenService.clearDataToken();

        this.loginService
            .logout(this.userData)
            .pipe(
                tap(() => {
                    this.router.navigate(['/login']);
                }),
                catchError((error) => {
                    this.router.navigate(['/login']);
                    return throwError(error);
                }),
            )
            .subscribe();
    }
}
