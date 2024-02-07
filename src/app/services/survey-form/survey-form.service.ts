import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';

@Injectable({
    providedIn: 'root',
})
export class SurveyFormService {
    baseUrl: string = `${environment.api.url}`;

    constructor(private http: HttpClient) {}

    getSurveyForm() {
        return this.http.get(`${this.baseUrl}${config.api.path.surveyForm.baseUrl}`);
    }

    createSurveyForm(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.surveyForm.baseUrl}`, data);
    }

    editSurveyForm(data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.surveyForm.baseUrl}`, data);
    }

    deleteSurveyForm(data: any) {
        return this.http.delete(`${this.baseUrl}${config.api.path.surveyForm.baseUrl}`, data);
    }

    getSurveyFormByPage(page: number, limit: number, sortId: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.surveyForm.baseUrl}/${page}/${limit}/${sortId}`);
    }

    getSurveyFormById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.surveyForm.baseUrl}${config.api.path.surveyForm.find}/${id}`);
    }

    countSurveyForm() {
        return this.http.get(`${this.baseUrl}${config.api.path.surveyForm.baseUrl}${config.api.path.surveyForm.count}`);
    }
}
