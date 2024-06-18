import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { end } from '@popperjs/core';
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

    getCallsPage(
        page: number,
        limit: number,
        sortId: string,
        searchText: string,
        createdBy: string,
        dateFilterType: string,
        startDate: string,
        endDate: string,
    ) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        if (dateFilterType == '' || dateFilterType == null) {
            dateFilterType = 'undefined';
        }
        if (startDate == '' || startDate == null) {
            startDate = 'undefined';
        }
        if (endDate == '' || endDate == null) {
            endDate = 'undefined';
        }
        return this.http.get(
            `${this.baseUrl}${config.api.path.call.url}/${page}/${limit}/${sortId}/${searchText}/${createdBy}/${dateFilterType}/${startDate}/${endDate}`,
        );
    }

    getCallsCount(searchText: string, createdById: string, dateFilterType: string, startDate: string,
      endDate: string,) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        if (createdById == '' || createdById == null) {
            createdById = 'undefined';
        }
        if (dateFilterType == '' || dateFilterType == null) {
            dateFilterType = 'undefined';
        }
        if (startDate == '' || startDate == null) {
            startDate = 'undefined';
        }
        if (endDate == '' || endDate == null) {
            endDate = 'undefined';
        }
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.count}/${searchText}/${createdById}/${dateFilterType}/${startDate}/${endDate}`);
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

    getActivitiesTypeSmn(searchText: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.activitySmn}/${searchText}`);
    }

    createCalls(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.call.url}`, data);
    }

    createActivityTopic(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.createActivityTopic}`, data);
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

    getActivityById(searchText: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.activitybyid}/${searchText}`);
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

    getActivityIdByPage(searchText: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.activitybyidBypage}/${searchText}`);
    }

    getCallById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.callById}/${id}`);
    }

    getCaseById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.caseById}/${id}`);
    }

    getContactNumbertById(id: string) {
      return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.contactNumberById}/${id}`);
  }
}
