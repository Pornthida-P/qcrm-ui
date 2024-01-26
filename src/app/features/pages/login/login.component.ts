import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    value: string | undefined;

    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private userServices: UserService,
        private tokenServices: TokenService,
        private sweetalertServices: SweetAlertService,
    ) {
        this.loginForm = this.fb.group({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });
    }

    get username() {
        return this.loginForm.controls['username'];
    }

    get password() {
        return this.loginForm.controls['password'];
    }

    ngOnInit(): void {
        this.userServices.clearDataUser();
        this.tokenServices.clearDataToken();
        this.loginService.logout();
    }

    onSubmit(form: FormGroup) {
        const username = form.value.username;
        const password = form.value.password;
        if (username && password) {
            this.loginService
                .getLogin(username, password)
                .pipe(
                    tap((res: any) => {
                        this.userServices.setDataUser(res.user);
                        this.tokenServices.setDataToken(res.token);
                        this.loginService.login();
                    }),
                    catchError((error) => {
                        this.handleLoginError(error);
                        return throwError(error);
                    }),
                )
                .subscribe();
        }
    }

    handleLoginError(error: any) {
        let errorMessage: string;
        let title: string;

        switch (error.status) {
            case 401:
                title = 'Login Error';
                errorMessage = 'Username or password is incorrect';
                break;
            default:
                title = 'Login Error';
                errorMessage = 'Login failed. Please try again';
                break;
        }

        this.sweetalertServices.getSwal('error', title, errorMessage, false, '');
    }
}
