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

    getEmailSurvey(startDate: string, endDate: string, users: any) {
        return this.http.get(`${this.baseUrl}${config.api.path.report.sendEmailSurvey}/${startDate}/${endDate}/${users}`);
    }

    getCaseDetail(startDate: string, endDate: string, users: any) {
        return this.http.get(`${this.baseUrl}${config.api.path.report.caseDetail}/${startDate}/${endDate}/${users}`);
    }

    getSurveyForm(startDate: string, endDate: string, formId: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.report.surveyForm}/${startDate}/${endDate}/${formId}`);
    }

    getAgent() {
        return this.http.get(`${this.baseUrl}${config.api.path.report.getAgent}`);
    }

    getSurvey() {
        return this.http.get(`${this.baseUrl}${config.api.path.report.getSurvey}`);
    }

  getSurveySendById(id: any, startDate: string, endDate: string, dateFilterType: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.report.getSurveySendById}/${id}/${startDate}/${endDate}/${dateFilterType}`);
    }
}
