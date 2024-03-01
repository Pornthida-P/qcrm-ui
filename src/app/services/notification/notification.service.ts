import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(private http: HttpClient) {}

    findNotificationUnRead(userId: string): Observable<any> {
        return this.http.get(`${environment.api.url}${config.api.path.notification.findNotificationUnReadByUserId}${userId}`);
    }

    findNotificationRead(userId: string): Observable<any> {
        return this.http.get(`${environment.api.url}${config.api.path.notification.findNotificationReadByUserId}${userId}`);
    }

    readNotification(userId: string): Observable<any> {
        return this.http.get(`${environment.api.url}${config.api.path.notification.readAllNotificationByUserId}${userId}`);
    }
}
