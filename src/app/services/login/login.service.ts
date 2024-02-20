import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';
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
        this.isLoginedSubject.next(statusLogin ? true : false);
    }

    isLogined(): Observable<boolean> {
        return this.isLoginedSubject.asObservable();
    }

    setLogined(status: boolean) {
        localStorage.setItem(this.keyIsLogined, JSON.stringify(status));
    }

    login(username: string, password: string): Observable<any> {
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
                this.setLogined(true);
                this.updateIsLogined();

                this.socketIO.login(res.user);
            }),
        );
    }

    logout(user: User): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.logout}`, { userId: user?.userId }).pipe(
            tap(() => {
                this.socketIO.logout(user);
            }),
        );
    }
}
