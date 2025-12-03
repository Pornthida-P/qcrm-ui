import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ReportService {
    constructor(private http: HttpClient) {}
    baseUrl: string = `${environment.api.url}`;

    getReportList() {
        return this.http.get(`${this.baseUrl}${config.api.path.report.baseUrl}${config.api.path.report.list}`);
    }
}
