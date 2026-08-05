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
    /** Bumps on each successful login so a late logout HTTP response cannot wipe the new session. */
    private authGeneration = 0;

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

    setLogined(status: boolean) {
        localStorage.setItem(this.keyIsLogined, JSON.stringify(status));
        this.isLoginedSubject.next(status);
    }

    clearLoginState(): void {
        localStorage.removeItem(this.keyIsLogined);
        this.isLoginedSubject.next(false);
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
                this.authGeneration += 1;
                this.setLogined(true);
                this.socketIO.login(res.user);
            }),
        );
    }

    logout(user: User): Observable<any> {
        const generationAtLogout = this.authGeneration;
        return this.http.post(`${this.baseUrl}${config.api.path.logout}`, { userId: user?.userId }).pipe(
            tap(() => {
                // Ignore if the user already logged in again before this response arrived.
                if (this.authGeneration !== generationAtLogout) {
                    return;
                }
                this.clearLoginState();
            }),
            catchError((error) => throwError(() => error)),
        );
    }

    crossAuth(ott: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/cross-auth`, { ott }).pipe(
            tap((res: any) => {
                if (res.user) {
                    res.user.profile = res.user.profile ? `${environment.api.url}${res.user.profile}` : '';
                }
                this.authGeneration += 1;
                this.setLogined(true);
            }),
        );
    }
}
