import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private isLoginedSubject = new BehaviorSubject<boolean>(false);
    private keyIsLogined = 'isLogined';

    constructor(private router: Router, private http: HttpClient) {
        const statusLogin = localStorage.getItem(this.keyIsLogined);
        if (statusLogin) {
            this.isLoginedSubject.next(true);
        } else {
            this.isLoginedSubject.next(false);
        }
    }

    baseUrl: string = `${environment.api.url}`;

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('username:password'),
    });

    isLogined(): Observable<boolean> {
        return this.isLoginedSubject.asObservable();
    }

    login() {
        localStorage.setItem(this.keyIsLogined, 'true');
        this.isLoginedSubject.next(true);
        this.router.navigate(['/home']);
    }

    logout() {
        localStorage.removeItem(this.keyIsLogined);
    }

    checklogin() {
        const bucket = localStorage.getItem(this.keyIsLogined);
        return bucket == 'true' ? true : false;
    }

    getLogin(username: string, password: string) {
        return this.http.post(
            `${this.baseUrl}${config.api.path.login}`,
            {
                username: username,
                password: password,
            },
            {
                headers: this.headers,
            },
        );
    }
}
