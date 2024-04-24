import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CallService {
    constructor(private http: HttpClient) {}
    baseUrl: string = `${environment.api.url}`;

    getCalls(page: number, limit: number) {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}/${page}/${limit}`);
    }

    getCallsPage(page: number, limit: number, sortId: string, searchText: string, createdBy: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}/${page}/${limit}/${sortId}/${searchText}/${createdBy}`);
    }

    getCallsCount(searchText: string, createdById: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        if (createdById == '' || createdById == null) {
            createdById = 'undefined';
        }
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.count}/${searchText}/${createdById}`);
    }

    getCaseTopic() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.caseTopic}`);
    }

    getOrganizations() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.organizations}`);
    }

    getAllContacts() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.contacts}`);
    }

    getContactById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.contactid}/${id}`);
    }

    getContactByPage(page: number, limit: number, sortId: string, searchText: string, createdBy: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        return this.http.get(
            `${this.baseUrl}${config.api.path.call.url}${config.api.path.call.contactbypage}/${page}/${limit}/${sortId}/${searchText}/${createdBy}`,
        );
    }

    getAllCaseSubjects() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.caseSubjects}`);
    }

    getAllChannels() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.channels}`);
    }

    getActivitiesType() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.activitiesType}`);
    }

    createCalls(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.call.url}`, data);
    }

    countContact(searchText: string, createdById: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        if (createdById == '' || createdById == null) {
            createdById = 'undefined';
        }
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.countcontact}${searchText}/${createdById}`);
    }

    getActivityById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.activitybyid}/${id}`);
    }

    countActivityById(searchText: string, createdById: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        if (createdById == '' || createdById == null) {
            createdById = 'undefined';
        }
        return this.http.get(
            `${this.baseUrl}${config.api.path.call.url}${config.api.path.call.activitybyidCount}${searchText}/${createdById}`,
        );
    }

    getActivityIdByPage(page: number, limit: number, sortId: string, searchText: string, createdBy: string, id: string ) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        return this.http.get(
            `${this.baseUrl}${config.api.path.call.url}${config.api.path.call.activitybyidBypage}/${page}/${limit}/${sortId}/${searchText}/${createdBy}/${id}`,
        );
    }
}
