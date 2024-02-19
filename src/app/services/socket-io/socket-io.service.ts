import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket, io } from 'socket.io-client';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';
import { SweetAlertService } from '../sweet-alert/sweet-alert.service';

@Injectable({
    providedIn: 'root',
})
export class SocketIoService {
    socket: Socket;

    isOnline: User[] = [];

    constructor(private router: Router, private sweetAlertService: SweetAlertService) {
        this.socket = io(environment.socket.url, { transports: ['websocket'] });

        this.socket.on('onlineStatusUpdate', (data) => {
            this.isOnline = data;
        });

        this.socket.on('forceLogout', () => {
            sweetAlertService.getSwal('warning', 'Warning Session', 'Your account has been forced to logout', false, '');
            this.router.navigate(['/logout']);
        });

        this.socket.on('disconnect', () => {
            sweetAlertService.getSwal('warning', 'Warning Session', 'Server has been disconnected', false, '');
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
