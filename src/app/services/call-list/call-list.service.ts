import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';

@Injectable({
    providedIn: 'root',
})
export class CallListService {
    baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = `${environment.api.url}${config.api.path.callList.baseUrl}`;
    }

    getAllCallList() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.all}`);
    }

    getCaseListByUserId(userId: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.agent}/${userId}`);
    }

    getStatusList() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.status}`);
    }
}
