import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';

@Injectable({
    providedIn: 'root',
})
export class ContactsService {
    baseUrl: string = `${environment.api.url}`;

    constructor(private http: HttpClient) {}

    getContacts() {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}`);
    }

    createContacts(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.contacts.baseUrl}`, data);
    }

    editContacts(data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.contacts.baseUrl}`, data);
    }

    deleteContacts(data: any) {
        return this.http.delete(`${this.baseUrl}${config.api.path.contacts.baseUrl}`, data);
    }

    deleteSurvey(data: any) {
        return this.http.delete(`${this.baseUrl}${config.api.path.contacts.baseUrl}/survey`, data);
    }

    getContactsByPage(page: number, limit: number, sortId: string, searchText: string, createdBy: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}/${page}/${limit}/${sortId}/${searchText}/${createdBy}`);
    }

    getContactsById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.find}/${id}`);
    }

    getContactsByParamPhone(phone: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.paramsFide}/${phone}`);
    }
  
      getContactActivities(id: string) {
        return this.http.get(`${this.baseUrl}/drive/user/activities/${id}`);
    }

    getDriveContact(id: string) {
        return this.http.get(`${this.baseUrl}/drive/user/${id}`);
    }

    getContactSurveyForm(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.surveyForm}/${id}`);
    }

    getContactCall(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.call}/${id}`);
    }

    getContactsSurvey(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}/survey/${id}`);
    }

    getAllOrganization() {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}/organization`);
    }

    countContacts(searchText: string, createdById: string) {
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

    saveContactsData(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.contacts.baseUrl}`, data);
    }
}
