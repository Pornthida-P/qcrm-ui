import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { LoginService } from 'src/app/services/login/login.service';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import { IdleService } from 'src/app/services/idle/idle.service';

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
        private socketIO: SocketIoService,
        private router: Router,
        private auditLogService: AuditLogService,
        private idleService: IdleService,
    ) {}

    ngOnInit(): void {
        this.initzation();
    }

    initzation(): void {
        this.getDataUser();
    }

    getDataUser(): void {
        this.userService
            .getDataUser()
            .pipe(take(1))
            .subscribe((res: User | null) => {
                this.userData = res;
                setTimeout(() => {
                    this.logout();
                }, 1000);
            });
    }

    logout(): void {
        // หยุด idle timeout เมื่อ logout
        this.idleService.stop();

        if (this.userData) {
            this.loginService.logout(this.userData).subscribe();
        }
        this.auditLogService.log('', 'Logout', '', 'User Logout', `User ${this.userData?.username} logged out successfully`, `Success`);
        this.userService.clearDataUser();
        this.tokenService.clearDataToken();
        this.router.navigate(['/login']);
    }
}
