import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { config } from 'src/app/config/config';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userDataSubject = new BehaviorSubject<User | null>(null);
    private memberSubject = new BehaviorSubject<void>(undefined);
    private storageKey = 'userData';

    baseUrl: string = `${environment.api.url}`;

    constructor(private http: HttpClient) {
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
            this.userDataSubject.next(JSON.parse(storedData));
        }
    }

    getAllUser(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}${config.api.path.user.findAll}`).pipe(
            tap((res: User[]) => {
                res.forEach((user: User) => {
                    user.profile = user.profile ? `${environment.api.url}${user.profile}` : '';
                });
            }),
        );
    }

    getDataUser(): Observable<User | null> {
        return this.userDataSubject.asObservable();
    }

    getCurrentUser(): User | null {
        return this.userDataSubject.getValue();
    }

    refreshFromStorage(): void {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as User;
                this.userDataSubject.next(parsed);
            } catch {
                // ignore parse error
            }
        }
    }

    userIsRefresh() {
        const userData = this.userDataSubject.getValue();
        this.http
            .get<User>(`${this.baseUrl}${config.api.path.user.findById}${userData?.userId}`)
            .pipe(
                tap((res: User) => {
                    if (res.profile) {
                        res.profile = res.profile ? `${environment.api.url}${res.profile}` : '';
                    }
                    this.setDataUser(res);
                }),
            )
            .subscribe(() => {});
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

    findAllRoles(): Observable<any> {
        return this.http.get(`${this.baseUrl}${config.api.path.user.findAllRoles}`);
    }

    uploadProfileImage(file: File, filename: string, userId: string, createdAt: string, createdById: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', filename);
        formData.append('userId', userId);
        formData.append('createdAt', createdAt);
        formData.append('createdById', createdById);

        return this.http.post(`${this.baseUrl}${config.api.path.user.uploadProfileImage}`, formData);
    }

    addUser(userData: User): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.user.add}`, userData).pipe(
            tap(() => {
                this.memberSubject.next();
            }),
        );
    }

    updateUser(userData: User): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.user.update}`, userData).pipe(
            tap(() => {
                this.userIsRefresh();
                this.memberSubject.next();
            }),
        );
    }

    updatePassword(userId: string, newPassword: string, currentPassword: string): Observable<any> {
        const body = { userId, newPassword, currentPassword };
        return this.http.post(`${this.baseUrl}${config.api.path.user.updatePassword}`, body);
    }

    deleteUser(userId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.user.deleteUser}`, { userId: userId }).pipe(
            tap(() => {
                this.memberSubject.next();
            }),
        );
    }

    getMemberOnRefrash(): Observable<void> {
        return this.memberSubject.asObservable();
    }
}
