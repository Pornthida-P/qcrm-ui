import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from 'src/app/config/config';
import { Observable, Subscription, catchError, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuditLogService {
    private http: HttpClient;

    constructor(httpBackend: HttpBackend) {
        this.http = new HttpClient(httpBackend);
    }

    async log(username: string, menu: string, caseId: string = '', action: string, detail: string, status: string) {
        const userData = localStorage.getItem('userData');
        if (userData && username == '') username = this.getJson(userData).username;
        if (userData || username != '') {
            const apiUrl = `${config.strapi.url}${config.strapi.path.auditlog}`;
            const body = {
                data: {
                    user: username,
                    menu,
                    case_id: caseId,
                    action,
                    detail,
                    status,
                },
            };

            const httpOptions = {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${config.strapi.key}`,
                    'Content-Type': 'application/json',
                }),
            };

            this.http.post(apiUrl, body, httpOptions).subscribe(
                (response) => {},
                (error) => {
                    console.error('API Error:', error);
                },
            );
        }
    }

    getJson(userData: any) {
        if (userData) {
            return JSON.parse(userData);
        } else {
            return null;
        }
    }
}
