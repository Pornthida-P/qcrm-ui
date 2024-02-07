import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

    findByDate(date: string): Observable<any> {
        return this.http.get(`${this.baseUrl}${config.api.path.calendarEvent.findByDate}/${date}`);
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
        console.log('onSetRefreshData');
        this.refreshDataSubject.next();
    }

    findAllTags(): Observable<any> {
        return this.http.get(`${this.baseUrl}${config.api.path.calendarEvent.findAlltags}`);
    }
}
