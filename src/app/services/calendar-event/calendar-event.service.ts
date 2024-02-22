import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { config } from 'src/app/config/config';
import { CalendarEvent, CalendarTag } from 'src/app/shared/interface/calendar.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CalendarEventService {
    baseUrl: string = `${environment.api.url}`;
    private refreshDataSubject = new BehaviorSubject<void>(undefined);
    private refreshTagSubject = new BehaviorSubject<void>(undefined);

    constructor(private http: HttpClient) {}

    getAllCalendarEvent(): Observable<any> {
        return this.http.get(`${this.baseUrl}${config.api.path.calendarEvent.findAll}`);
    }

    findByDate(date: string): Observable<CalendarEvent[]> {
        return this.http.get(`${this.baseUrl}${config.api.path.calendarEvent.findByDate}/${date}`).pipe(
            map((res: any) => {
                for (let event of res) {
                    if (event.members) {
                        for (let member of event.members) {
                            member.profile = member.profile ? `${environment.api.url}${member.profile}` : '';
                        }
                    }
                }
                return res as CalendarEvent[];
            }),
        );
    }

    findEventByTagId(tagId: number): Observable<CalendarEvent[]> {
        return this.http.get(`${this.baseUrl}${config.api.path.calendarEvent.findByTagId}${tagId}`).pipe(
            map((res: any) => {
                for (let event of res) {
                    if (event.members) {
                        for (let member of event.members) {
                            member.profile = member.profile ? `${environment.api.url}${member.profile}` : '';
                        }
                    }
                }
                return res as CalendarEvent[];
            }),
        );
    }

    addCalendarEvent(data: CalendarEvent): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.calendarEvent.add}`, data).pipe(tap(() => this.onSetRefreshData()));
    }

    addCalendarTag(data: CalendarTag): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.calendarEvent.addTag}`, data).pipe(tap(() => this.onSetRefrashTag()));
    }

    updateCalendarEvent(id: string, data: CalendarEvent): Observable<any> {
        return this.http
            .post(`${this.baseUrl}${config.api.path.calendarEvent.update}/${id}`, data)
            .pipe(tap(() => this.onSetRefreshData()));
    }

    updateCalendarTag(data: CalendarTag): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.calendarEvent.updateTag}`, data).pipe(tap(() => this.onSetRefrashTag()));
    }

    deleteCalendarEvent(id: string): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.calendarEvent.delete}/${id}`, {}).pipe(tap(() => this.onSetRefreshData()));
    }

    deleteTag(data: CalendarTag): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.calendarEvent.deleteTag}`, data).pipe(tap(() => this.onSetRefrashTag()));
    }

    onRefreshData(): Observable<void> {
        return this.refreshDataSubject.asObservable();
    }

    onRefrashTag(): Observable<void> {
        return this.refreshTagSubject.asObservable();
    }

    onSetRefrashTag(): void {
        this.refreshTagSubject.next();
    }

    onSetRefreshData(): void {
        this.refreshDataSubject.next();
    }

    findAllTags(): Observable<any> {
        return this.http.get(`${this.baseUrl}${config.api.path.calendarEvent.findAlltags}`);
    }
}
