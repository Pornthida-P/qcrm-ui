import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { config } from 'src/app/config/config';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userDataSubject = new BehaviorSubject<User | null>(null);
    private storageKey = 'userData';

    baseUrl: string = `${environment.api.url}`;

    constructor(private http: HttpClient) {
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
            this.userDataSubject.next(JSON.parse(storedData));
        }
    }

    getAllUser(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}${config.api.path.user.findAll}`);
    }

    getDataUser(): Observable<User | null> {
        return this.userDataSubject.asObservable();
    }

    setDataUser(value: User | null) {
        if (value) {
            localStorage.setItem(this.storageKey, JSON.stringify(value));
        } else {
            localStorage.removeItem(this.storageKey);
        }

        this.userDataSubject.next(value);
    }

    clearDataUser() {
        localStorage.removeItem(this.storageKey);
        this.userDataSubject.next(null);
    }
}
