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

    updateContactNumbers(contactId: string, contactNumbers: any[]) {
        return this.http.put(`${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.updateContactNumbers}`, {
            contactId,
            contactNumbers,
        });
    }

    deleteContacts(data: any) {
        return this.http.delete(`${this.baseUrl}${config.api.path.contacts.baseUrl}`, data);
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

    getContactCall(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.call}/${id}`);
    }

    getAllOrganization() {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}/organization`);
    }

    getOrganizationById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}/organization/${id}`);
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

    countByAssignedUserId(assignedUserId: string) {
        if (assignedUserId == '' || assignedUserId == null) {
            assignedUserId = 'undefined';
        }
        return this.http.get(
            `${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.countByAssignedUserId}/${assignedUserId}`,
        );
    }

    saveContactsData(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.contacts.baseUrl}`, data);
    }

    countOrg(searchText: string, createdById: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        if (createdById == '' || createdById == null) {
            createdById = 'undefined';
        }
        return this.http.get(
            `${this.baseUrl}${config.api.path.contacts.baseUrl}/organization${config.api.path.contacts.count}/${searchText}/${createdById}`,
        );
    }

    getOrgByPage(page: number, limit: number, sortId: string, searchText: string, createdBy: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        return this.http.get(
            `${this.baseUrl}${config.api.path.contacts.baseUrl}/organization/${page}/${limit}/${sortId}/${searchText}/${createdBy}`,
        );
    }

    createOrg(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.contacts.baseUrl}/organization`, data);
    }


    updateCalls(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.contacts.baseUrl}/update-call`, data);
    }


    deleteCall(id: string) {
        return this.http.delete(`${this.baseUrl}${config.api.path.contacts.baseUrl}/call/${id}`);
    }

    getContactNumberIdByPhone(phone: string) {
        return this.http.get(
            `${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.contactNumberIdByPhone}/${phone}`,
        );
    }

    getContactGroup() {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.contactGroup}`);
    }

    getContactChatId(chatId: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.contacts.baseUrl}${config.api.path.contacts.contactChatId}/${chatId}`);
    }
}
