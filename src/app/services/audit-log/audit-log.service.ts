import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/** รอ audit log ส่งไม่เกินกี่ ms แล้วให้ complete ไป (ป้องกัน user ค้างถ้า Strapi ช้า/ลง) */
const AUDIT_LOG_TIMEOUT_MS = 10_000;

@Injectable({
    providedIn: 'root',
})
export class AuditLogService {
    private http: HttpClient;

    constructor(httpBackend: HttpBackend) {
        this.http = new HttpClient(httpBackend);
    }

    /**
     * ส่ง audit log ไป Strapi คืนค่า Observable ให้ caller subscribe ได้
     * ถ้ามี redirect/reload ทันทีหลัง log() ต้องรอ Observable นี้ก่อน เช่น
     * this.auditLogService.log(...).subscribe(() => { window.location.href = '...'; });
     */
    log(username: string, menu: string, caseId: string = '', action: string, detail: string, status: string): Observable<void> {
        const userData = localStorage.getItem('userData');
        if (userData && username == '') username = this.getJson(userData).username;
        if (!userData && username === '') {
            return of(undefined);
        }
        const apiUrl = `${environment.strapi.url}${environment.strapi.path.auditlog}`;
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
                Authorization: `Bearer ${environment.strapi.key}`,
                'Content-Type': 'application/json',
            }),
        };
        return this.http.post(apiUrl, body, httpOptions).pipe(
            timeout(AUDIT_LOG_TIMEOUT_MS),
            map(() => undefined),
            catchError((error) => {
                console.error('[AuditLog] API Error:', error?.status, error?.message, error?.url);
                return of(undefined);
            }),
        );
    }

    getJson(userData: any) {
        if (userData) {
            return JSON.parse(userData);
        } else {
            return null;
        }
    }
}
