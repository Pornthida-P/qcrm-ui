import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class LogoutComponent implements OnInit, OnDestroy {
    userData?: User | null;
    private logoutTimer: ReturnType<typeof setTimeout> | null = null;
    private didLogout = false;

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

    ngOnDestroy(): void {
        if (this.logoutTimer) {
            clearTimeout(this.logoutTimer);
            this.logoutTimer = null;
        }
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
                // Keep a short UI beat, but cancel on destroy so a later login is not wiped.
                this.logoutTimer = setTimeout(() => {
                    this.logoutTimer = null;
                    this.logout();
                }, 300);
            });
    }

    logout(): void {
        if (this.didLogout) {
            return;
        }
        this.didLogout = true;

        this.idleService.stop();
        this.socketIO.logout(this.userData);

        const userSnapshot = this.userData;
        if (userSnapshot) {
            this.loginService.logout(userSnapshot).subscribe({ error: () => {} });
        }

        this.auditLogService.log(
            '',
            'Logout',
            '',
            'User Logout',
            `User ${userSnapshot?.username} logged out successfully`,
            `Success`,
        );

        this.loginService.clearLoginState();
        this.userService.clearDataUser();
        this.tokenService.clearDataToken();
        this.router.navigate(['/login']);
    }
}
