import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket, io } from 'socket.io-client';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';
import { SweetAlertService } from '../sweet-alert/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class SocketIoService {
    socket: Socket;

    isOnline: User[] = [];

    constructor(
        private router: Router,
        private sweetAlertService: SweetAlertService,
        private translate: TranslateService,
    ) {
        this.socket = io(environment.socket.url, { transports: ['websocket'], path: environment.socket.path });

        this.socket.on('connect_error', (error) => {});

        this.socket.on('onlineStatusUpdate', (data) => {
            this.isOnline = data;
        });

        this.socket.on('forceLogout', () => {
            sweetAlertService.warning('alert.forceLogout');
            this.router.navigate(['/logout']);
        });

        this.socket.on('disconnect', () => {
            sweetAlertService.warning('alert.serverDisconnected');
            router.navigate(['/logout']);
        });
    }

    login(user?: User | null) {
        this.socket.emit('login', user);
    }

    logout(user?: User | null) {
        this.socket.emit('logout', user);
    }

    getStatusOnline(userId?: string): boolean {
        if (this.isOnline?.length > 0) {
            return this.isOnline.some((user) => user.userId === userId);
        }

        return false;
    }
}
