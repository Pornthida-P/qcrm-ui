import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { config } from 'src/app/config/config';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CalendarEventService {
    baseUrl: string = `${environment.api.url}`;
    private refreshDataSubject = new BehaviorSubject<void>(undefined);

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

    addCalendarEvent(data: CalendarEvent): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.calendarEvent.add}`, data).pipe(tap(() => this.onSetRefreshData()));
    }

    updateCalendarEvent(id: string, data: CalendarEvent): Observable<any> {
        return this.http
            .post(`${this.baseUrl}${config.api.path.calendarEvent.update}/${id}`, data)
            .pipe(tap(() => this.onSetRefreshData()));
    }

    deleteCalendarEvent(id: string): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.calendarEvent.delete}/${id}`, {}).pipe(tap(() => this.onSetRefreshData()));
    }

    onRefreshData(): Observable<void> {
        return this.refreshDataSubject.asObservable();
    }

    onSetRefreshData(): void {
        this.refreshDataSubject.next();
    }

    findAllTags(): Observable<any> {
        return this.http.get(`${this.baseUrl}${config.api.path.calendarEvent.findAlltags}`);
    }
}
