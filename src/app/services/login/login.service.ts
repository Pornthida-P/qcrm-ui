import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';
import { Socket, io } from 'socket.io-client';
import { User } from 'src/app/shared/interface/user.interface';
import { SweetAlertService } from '../sweet-alert/sweet-alert.service';
import { SocketIoService } from '../socket-io/socket-io.service';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private isLoginedSubject = new BehaviorSubject<boolean>(false);
    private keyIsLogined = 'isLogined';

    constructor(private router: Router, private http: HttpClient, private socketIO: SocketIoService) {
        this.updateIsLogined();
    }

    baseUrl: string = `${environment.api.url}`;

    private updateIsLogined() {
        const statusLogin = localStorage.getItem(this.keyIsLogined);
        this.isLoginedSubject.next(statusLogin === 'true');
    }

    isLogined(): Observable<boolean> {
        return this.isLoginedSubject.asObservable();
    }

    login() {
        localStorage.setItem(this.keyIsLogined, JSON.stringify(true));
        this.isLoginedSubject.next(true);
        this.router.navigate(['/home']);
    }

    logout(user?: User | null): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.logout}`, { userId: user?.userId }).pipe(
            tap(() => {
                this.socketIO.logout(user);
            }),
        );
    }

    checklogin() {
        const bucket = localStorage.getItem(this.keyIsLogined);
        return bucket == 'true' ? true : false;
    }

    getLogin(username: string, password: string) {
        const credentials = btoa(`${username}:${password}`);

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Basic ${credentials}`,
        });

        const body = {};

        return this.http.post(`${this.baseUrl}${config.api.path.login}`, body, { headers }).pipe(
            tap((res: any) => {
                if (res.user) {
                    res.user.profile = res.user.profile ? `${environment.api.url}${res.user.profile}` : '';
                }
            }),
        );
    }
}
