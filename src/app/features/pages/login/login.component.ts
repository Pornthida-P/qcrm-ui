import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';

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

    ngOnInit(): void {}

    onSubmit(form: FormGroup) {
        const username = form.value.username;
        const password = form.value.password;
        if (username && password) {
            this.loginService
                .login(username, password)
                .pipe(
                    tap((res: { user: User; token: string }) => {
                        this.userServices.setDataUser(res.user);
                        this.tokenServices.setDataToken(res.token);
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        return throwError(error);
                    }),
                )
                .subscribe(() => {});
        }
    }
}
