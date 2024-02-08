import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { config } from 'src/app/config/config';
import { Announce } from 'src/app/shared/interface/announce.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AnnouncementService {
    private refreshDataSubject = new BehaviorSubject<void>(undefined);

    constructor(private http: HttpClient) {}

    findAll(): Observable<any> {
        return this.http.get(`${environment.api.url}${config.api.path.announcement.findAll}`);
    }

    findByDate(date: string): Observable<any> {
        return this.http.get(`${environment.api.url}${config.api.path.announcement.findByDate}${date}`);
    }

    add(form: Announce): Observable<any> {
        return this.http.post(`${environment.api.url}${config.api.path.announcement.add}`, form).pipe(
            tap(() => {
                this.onSetRefrashData();
            }),
        );
    }

    update(form: Announce): Observable<any> {
        return this.http.post(`${environment.api.url}${config.api.path.announcement.update}`, form).pipe(
            tap(() => {
                this.onSetRefrashData();
            }),
        );
    }

    delete(announceId: string): Observable<any> {
        return this.http.post(`${environment.api.url}${config.api.path.announcement.delete}${announceId}`, {}).pipe(
            tap(() => {
                this.onSetRefrashData();
            }),
        );
    }

    onSetRefrashData(): void {
        this.refreshDataSubject.next();
    }

    onRefreshData(): Observable<any> {
        return this.refreshDataSubject.asObservable();
    }
}
