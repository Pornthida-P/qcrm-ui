import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { LoginService } from 'src/app/services/login/login.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import { IdleService } from 'src/app/services/idle/idle.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    value: string | undefined;

    loginForm: FormGroup;
    userData?: User | null;
    showPassword: boolean = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private loginService: LoginService,
        private userServices: UserService,
        private tokenServices: TokenService,
        private sweetalertServices: SweetAlertService,
        private auditLogService: AuditLogService,
        private idleService: IdleService,
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
        this.initzation();
    }

    initzation(): void {
        this.getUserData();
        setTimeout(() => {
            if (this.userData) {
                this.router.navigate(['/home']);
            }
        }, 1000);
    }

    getUserData(): void {
        this.userServices.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
        });
    }

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

                        // เริ่มต้น idle timeout หลังจาก login สำเร็จ
                        const idleTimeoutMinutes = environment.idle?.timeoutMinutes || 30;
                        this.idleService.setIdleTimeout(idleTimeoutMinutes);
                        this.idleService.start();

                        this.router.navigate(['/home']);
                        this.auditLogService
                            .log(
                                username,
                                'Login',
                                '',
                                'User Login',
                                `User ${username} logged in successfully ${JSON.stringify({
                                    userId: res.user.userId,
                                    fullname: res.user.username,
                                    email: res.user.email,
                                    roles: res.user.role.roleTitle,
                                })}`,
                                'Success',
                            )
                            .subscribe();
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService
                            .log(
                                username,
                                'Login',
                                '',
                                'User Login',
                                `User ${username} login failed - ${error.error?.message || error}`,
                                'Failed',
                            )
                            .subscribe();
                        return throwError(error);
                    }),
                )
                .subscribe(() => {});
        }
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }
}
