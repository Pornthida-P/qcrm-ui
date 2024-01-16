import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    value: string | undefined;

    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {
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
        // localStorage.removeItem(config.constant.accessToken);
    }

    onSubmit(form: FormGroup) {
        const username = form.value.username;
        const password = form.value.password;
        if (username && password) {
            this.loginService
                .getLogin(username, password)
                .pipe(
                    catchError((error) => {
                        if (error.status === 401) {
                            this.getSwal('error', 'username or password is incorrect', '', false, '');
                        } else {
                            this.getSwal('error', 'An error occurred', '', false, '');
                        }
                        return throwError(error);
                    }),
                )
                .subscribe((res) => {
                    this.loginService.login();
                });
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
