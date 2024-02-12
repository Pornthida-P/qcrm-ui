import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { config } from 'src/app/config/config';
import { Attachment } from 'src/app/shared/interface/attachment.interface';
import { Group } from 'src/app/shared/interface/group.interface';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userDataSubject = new BehaviorSubject<User | null>(null);
    private groupSubject = new BehaviorSubject<void>(undefined);
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

    findAllRoles(): Observable<any> {
        return this.http.get(`${this.baseUrl}${config.api.path.user.findAllRoles}`);
    }

    findAllGroups(): Observable<any> {
        return this.http.get(`${this.baseUrl}${config.api.path.user.findAllGroups}`).pipe(
            map((res: any) => {
                res.forEach((group: any) => {
                    group.members.forEach((member: any) => {
                        member.profile = member.profile ? `${environment.api.url}${member.profile}` : '';
                    });
                });
                return res;
            }),
        );
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
        return this.http.post(`${this.baseUrl}${config.api.path.user.findAll}`, userData);
    }

    updateUser(userData: User): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.user.update}`, userData);
    }

    updatePassword(userId: string, newPassword: string, currentPassword: string): Observable<any> {
        const body = { userId, newPassword, currentPassword };
        return this.http.post(`${this.baseUrl}${config.api.path.user.updatePassword}`, body);
    }

    addGroup(form: Group): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.user.addGroup}`, form).pipe(
            tap(() => {
                this.groupSubject.next();
            }),
        );
    }

    updateGroup(form: Group): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.user.updateGroup}`, form).pipe(
            tap(() => {
                this.groupSubject.next();
            }),
        );
    }

    setGroupOnRefrash() {
        this.groupSubject.next();
    }

    getGroupOnRefrash(): Observable<void> {
        return this.groupSubject.asObservable();
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
