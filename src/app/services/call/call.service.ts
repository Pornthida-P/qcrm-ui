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

    // Case Code
    getCaseCode() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-code`);
    }

    getCaseCodeById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-code/${id}`);
    }

    createCaseCode(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-code`, data);
    }

    updateCaseCode(id: string, data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-code/${id}`, data);
    }

    deleteCaseCode(id: string, modifiedById: string) {
        return this.http.delete(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-code/${id}`, {
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

    // Service Group
    getCaseServiceGroup() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-group`);
    }

    createCaseServiceGroup(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-group`, data);
    }

    updateCaseServiceGroup(id: string, data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-group/${id}`, data);
    }

    deleteCaseServiceGroup(id: string, modifiedById: string) {
        return this.http.delete(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-group/${id}`, {
            body: { modifiedById },
        });
    }

    // Service Type
    getCaseServiceType(caseServiceGroupId?: string | number) {
        const params: Record<string, string> = {};
        if (caseServiceGroupId !== undefined && caseServiceGroupId !== null && caseServiceGroupId !== '') {
            params['caseServiceGroupId'] = String(caseServiceGroupId);
        }
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-type`, { params });
    }

    getCaseServiceTypeByGroupId(caseServiceGroupId: string | number) {
        return this.getCaseServiceType(caseServiceGroupId);
    }

    createCaseServiceType(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-type`, data);
    }

    updateCaseServiceType(id: string, data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-type/${id}`, data);
    }

    deleteCaseServiceType(id: string, modifiedById: string) {
        return this.http.delete(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-type/${id}`, {
            body: { modifiedById },
        });
    }

    // Service Sub-Type
    getServiceSubType(caseServiceTypeId?: string | number) {
        const params: Record<string, string> = {};
        if (caseServiceTypeId !== undefined && caseServiceTypeId !== null && caseServiceTypeId !== '') {
            params['caseServiceTypeId'] = String(caseServiceTypeId);
        }
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/service-sub-type`, { params });
    }

    getServiceSubTypeByTypeId(caseServiceTypeId: string | number) {
        return this.getServiceSubType(caseServiceTypeId);
    }

    validateCaseServiceHierarchy(
        caseServiceGroupId?: string | number | null,
        caseServiceTypeId?: string | number | null,
        caseServiceSubTypeId?: string | number | null,
    ) {
        const params: Record<string, string> = {};
        if (caseServiceGroupId !== undefined && caseServiceGroupId !== null && caseServiceGroupId !== '') {
            params['caseServiceGroupId'] = String(caseServiceGroupId);
        }
        if (caseServiceTypeId !== undefined && caseServiceTypeId !== null && caseServiceTypeId !== '') {
            params['caseServiceTypeId'] = String(caseServiceTypeId);
        }
        if (caseServiceSubTypeId !== undefined && caseServiceSubTypeId !== null && caseServiceSubTypeId !== '') {
            params['caseServiceSubTypeId'] = String(caseServiceSubTypeId);
        }
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/validate-service-hierarchy`, { params });
    }

    getCaseServiceTypeSubType(caseServiceTypeId?: string | number, caseServiceSubTypeId?: string | number) {
        const params: Record<string, string> = {};
        if (caseServiceTypeId !== undefined && caseServiceTypeId !== null && caseServiceTypeId !== '') {
            params['caseServiceTypeId'] = String(caseServiceTypeId);
        }
        if (caseServiceSubTypeId !== undefined && caseServiceSubTypeId !== null && caseServiceSubTypeId !== '') {
            params['caseServiceSubTypeId'] = String(caseServiceSubTypeId);
        }
        return this.http.get(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-type-sub-type`, { params });
    }

    createCaseServiceTypeSubType(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-type-sub-type`, data);
    }

    syncCaseServiceTypeSubTypes(caseServiceTypeId: string | number, data: any) {
        return this.http.put(
            `${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-type/${caseServiceTypeId}/sub-types`,
            data,
        );
    }

    deleteCaseServiceTypeSubType(data: any) {
        return this.http.delete(`${this.baseUrl}${config.api.path.callList.baseUrl}/case-service-type-sub-type`, {
            body: data,
        });
    }

    createServiceSubType(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.baseUrl}/service-sub-type`, data);
    }

    updateServiceSubType(id: string, data: any) {
        return this.http.put(`${this.baseUrl}${config.api.path.callList.baseUrl}/service-sub-type/${id}`, data);
    }

    deleteServiceSubType(id: string, modifiedById: string) {
        return this.http.delete(`${this.baseUrl}${config.api.path.callList.baseUrl}/service-sub-type/${id}`, {
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
