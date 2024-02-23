import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SurveyService {
    baseUrl: string = `${environment.api.url}`;

    constructor(private http: HttpClient) {}

    checkExisting(surveyFormId: string, contactId: string) {
        return this.http.get(
            `${this.baseUrl}${config.api.path.survey.baseUrl}${config.api.path.survey.existing}/${surveyFormId}/${contactId}`,
        );
    }
}
