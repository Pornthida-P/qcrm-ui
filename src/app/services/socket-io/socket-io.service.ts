import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket, io } from 'socket.io-client';
import { Subject } from 'rxjs';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';
import { SweetAlertService } from '../sweet-alert/sweet-alert.service';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root',
})
export class SocketIoService {
    socket: Socket;

    isOnline: User[] = [];
    /** Fires after a reconnect (not the first connect) so pages can refresh missed chat data. */
    readonly reconnect$ = new Subject<void>();

    private intentionalDisconnect = false;
    private hasConnectedOnce = false;

    constructor(
        private router: Router,
        private sweetAlertService: SweetAlertService,
        private tokenService: TokenService,
        private userService: UserService,
    ) {
        this.socket = io(environment.socket.url, { transports: ['websocket'], path: environment.socket.path });

        this.socket.on('connect_error', (error) => {});

        this.socket.on('connect', () => {
            this.restoreSessionAfterConnect();
            if (this.hasConnectedOnce) {
                this.reconnect$.next();
            }
            this.hasConnectedOnce = true;
        });

        this.socket.on('onlineStatusUpdate', (data) => {
            this.isOnline = data;
        });

        this.socket.on('forceLogout', () => {
            if (!this.tokenService.getDataToken()) {
                return;
            }
            this.sweetAlertService.warning('alert.forceLogout');
            this.router.navigate(['/logout']);
        });

        // Transient disconnects (ngrok blips, reconnects) must not clear a fresh login session.
        this.socket.on('disconnect', () => {
            if (this.intentionalDisconnect) {
                this.intentionalDisconnect = false;
                return;
            }
            if (!this.tokenService.getDataToken()) {
                return;
            }
            this.sweetAlertService.warning('alert.serverDisconnected');
        });
    }

    login(user?: User | null) {
        this.intentionalDisconnect = false;
        if (user) {
            this.socket.emit('login', user);
            if (user.userId) {
                this.socket.emit('chat:join', user.userId);
            }
        }
    }

    logout(user?: User | null) {
        this.intentionalDisconnect = true;
        this.socket.emit('logout', user);
    }

    /** Re-join chat rooms after connect/reconnect (socket rooms are lost on disconnect). */
    joinChat(agentUserId?: string | null): void {
        if (!agentUserId) {
            return;
        }
        this.socket.emit('chat:join', agentUserId);
    }

    getStatusOnline(userId?: string): boolean {
        if (this.isOnline?.length > 0) {
            return this.isOnline.some((user) => user.userId === userId);
        }

        return false;
    }

    private restoreSessionAfterConnect(): void {
        if (!this.tokenService.isTokenValid()) {
            return;
        }
        const user = this.userService.getCurrentUser();
        if (!user?.userId) {
            return;
        }
        this.socket.emit('login', user);
        this.socket.emit('chat:join', user.userId);
    }
}
