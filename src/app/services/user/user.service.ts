import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/shared/interface/user.interface';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userDataSubject = new BehaviorSubject<User | null>(null);
    private storageKey = 'userData';

    constructor() {
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
            this.userDataSubject.next(JSON.parse(storedData));
        }
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
