import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { end } from '@popperjs/core';
import { Observable } from 'rxjs';
import { config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CallService {
    constructor(private http: HttpClient) {}
    baseUrl: string = `${environment.api.url}`;

    getCasesAll(page: number, limit: number) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}`);
    }

    getCasesAllWithoutPagination(
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
            `${this.baseUrl}${config.api.path.callList.baseUrl}/all/${sortId}/${searchText}/${createdBy}/${dateFilterType}/${startDate}/${endDate}`,
        );
    }

    getCasesPage(
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
            `${this.baseUrl}${config.api.path.callList.baseUrl}/${page}/${limit}/${sortId}/${searchText}/${createdBy}/${dateFilterType}/${startDate}/${endDate}`,
        );
    }

    getCallsCount(searchText: string, createdById: string, dateFilterType: string, startDate: string, endDate: string) {
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
        return this.http.get(
            `${this.baseUrl}${config.api.path.callList.baseUrl}/count/${searchText}/${createdById}/${dateFilterType}/${startDate}/${endDate}`,
        );
    }

    getAllContacts() {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}/all`);
    }

    getContactById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}/find/${id}`);
    }

    getContactByPage(page: number, limit: number, sortId: string, searchText: string, createdBy: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}/${page}/${limit}/${sortId}/${searchText}/${createdBy}`);
    }

    getAllChannels() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}${config.api.path.callList.channels}`);
    }

    createCalls(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}`, data);
    }

    countContact(searchText: string, createdById: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        if (createdById == '' || createdById == null) {
            createdById = 'undefined';
        }
        return this.http.get(
            `${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.count}/${searchText}/${createdById}`,
        );
    }

    getCaseById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-id/${id}`);
    }

    getCasesByContactId(contactId: string, limit = 5) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/contact/${contactId}`, {
            params: { limit: String(limit) },
        });
    }

    updateCase(data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.callList.baseUrl}`, data);
    }

    getContactNumbertById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}/contact-numbers/${id}`);
    }

    getAllStatus() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}${config.api.path.callList.status}`);
    }

    createCase(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}`, data);
    }

    // Case Topic
    getCaseTopics() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-topic`);
    }

    getCaseTopicById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-topic/${id}`);
    }

    createCaseTopic(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-topic`, data);
    }

    updateCaseTopic(id: string, data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-topic/${id}`, data);
    }

    deleteCaseTopic(id: string, modifiedById: string) {
        return this.http.delete(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-topic/${id}`, {
            body: { modifiedById },
        });
    }

    // Case Subject
    getCaseSubjects(caseTopicId?: string | number) {
        const params: Record<string, string> = {};
        if (caseTopicId !== undefined && caseTopicId !== null && caseTopicId !== '') {
            params['caseTopicId'] = String(caseTopicId);
        }
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-subject`, { params });
    }

    getCaseSubjectById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-subject/${id}`);
    }

    createCaseSubject(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-subject`, data);
    }

    updateCaseSubject(id: string, data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-subject/${id}`, data);
    }

    deleteCaseSubject(id: string, modifiedById: string) {
        return this.http.delete(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-subject/${id}`, {
            body: { modifiedById },
        });
    }

    // Case Type
    getCaseType() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-type`);
    }

    createCaseType(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-type`, data);
    }

    updateCaseType(id: string, data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-type/${id}`, data);
    }

    deleteCaseType(id: string, modifiedById: string) {
        return this.http.delete(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-type/${id}`, {
            body: { modifiedById },
        });
    }

    // Sentiment
    getSentiment() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/sentiment`);
    }

    createSentiment(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}/sentiment`, data);
    }

    updateSentiment(id: string, data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.callList.baseUrl}/sentiment/${id}`, data);
    }

    deleteSentiment(id: string, modifiedById: string) {
        return this.http.delete(`${this.baseUrl}${config.api.path.callList.baseUrl}/sentiment/${id}`, {
            body: { modifiedById },
        });
    }
}
