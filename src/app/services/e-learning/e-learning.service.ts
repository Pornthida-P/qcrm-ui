import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';

@Injectable({
    providedIn: 'root',
})
export class ELearningService {
    constructor(private http: HttpClient) {}
    baseUrl: string = `${environment.api.url}`;

    getELearning(page: number, limit: number, sortId: string, search: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.elearning}/${page}/${limit}/${sortId}?s=${search}`);
    }

    getELearningById(topicId: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.elearning}/findById/${topicId}`);
    }

    getELearningPage(search: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.elearning}/page?s=${search}`);
    }
}
