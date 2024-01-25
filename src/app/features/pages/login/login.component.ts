import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

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

    private handleLoginError(error: any) {
        if (error.status === 401) {
            this.getSwal('error', 'username or password is incorrect', '', false, '');
        } else {
            this.getSwal('error', 'An error occurred', '', false, '');
        }
    }

    getSwal(icon: any, title: string, text: string, showButton: boolean, route: string) {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            showConfirmButton: showButton,
            confirmButtonColor: '#0a6ebd',
        });
    }
}
