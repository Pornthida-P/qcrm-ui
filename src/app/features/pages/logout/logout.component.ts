import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { LoginService } from 'src/app/services/login/login.service';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
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
        private socketIO: SocketIoService,
        private router: Router,
        private auditLogService: AuditLogService,
    ) {}

    ngOnInit(): void {
        this.initzation();
    }

    initzation(): void {
        this.getDataUser();
        setTimeout(() => {
            this.logout();
        }, 1000);
    }

    getDataUser(): void {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
        });
    }

    logout(): void {
        if (this.userData) {
            this.loginService.logout(this.userData).subscribe();
        }
        this.auditLogService.log('', 'Logout', '', 'User Logout', `User ${this.userData?.username} logged out successfully`, `Success`);
        this.userService.clearDataUser();
        this.tokenService.clearDataToken();
        this.router.navigate(['/login']);
    }
}
