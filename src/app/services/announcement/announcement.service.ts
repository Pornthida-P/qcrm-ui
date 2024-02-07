import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AnnouncementService {
    constructor(private http: HttpClient) {}

    findAll(): Observable<any> {
        return this.http.get(`${environment.api.url}${config.api.path.announcement.findAll}`);
    }

    findByDate(date: string): Observable<any> {
        return this.http.get(`${environment.api.url}${config.api.path.announcement.findByDate}${date}`);
    }
}
