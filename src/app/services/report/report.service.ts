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

    getChannelByAgent(startDate: string, endDate: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.report.channelByAgent}/${startDate}/${endDate}`);
    }

    getCaseTypeByAgent(startDate: string, endDate: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.report.caseTypeByAgent}/${startDate}/${endDate}`);
    }

    getSummaryByMonth(startYear: string, endYear: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.report.summaryByMonth}/${startYear}/${endYear}`);
    }

    getEmailSurvey(startDate: string, endDate: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.report.sendEmailSurvey}/${startDate}/${endDate}`);
    }
}
