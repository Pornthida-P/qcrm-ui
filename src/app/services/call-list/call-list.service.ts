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

    createComment(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.callList.comment}`, data);
    }

    getComment(caseId: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.comment}/${caseId}`);
    }

    getChatHistory(chatId: string) {
        return this.http.post(`${environment.api.urlQIM}${config.api.path.chatHistory}`, { chat_room_id: chatId });
    }

    getCallStatus() {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.callStatus}`);
    }

    getCallStatusId(callStatusId: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.callStatusId}/${callStatusId}`);
    }

    getHistory(caseId: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.callList.history}/${caseId}`);
    }

    // Phase 2: Admin Lead Management APIs

    getAgentWorkload() {
        return this.http.get(`${this.baseUrl}/agent-workload`);
    }

    getAgentWorkloadWithOpenCases() {
        return this.http.get(`${this.baseUrl}/agent-workload-open-cases`);
    }

    getActiveAgents() {
        return this.http.get(`${this.baseUrl}/active-agents`);
    }

    getAdminLeads(filter: string = 'all') {
        return this.http.get(`${this.baseUrl}/admin-leads/${filter}`);
    }

    getLeadsForReassignment() {
        return this.http.get(`${this.baseUrl}/leads-for-reassignment`);
    }

    reassignLeads(agentIds?: string[], modifiedById?: string) {
        return this.http.post(`${this.baseUrl}/reassign-leads`, { agentIds, modifiedById });
    }

    reassignFromAgent(sourceAgentId: string, targetAgentIds: string[], modifiedById?: string) {
        return this.http.post(`${this.baseUrl}/reassign-from-agent`, { sourceAgentId, targetAgentIds, modifiedById });
    }

    reassignCase(caseId: string, newAgentId: string, modifiedById: string) {
        return this.http.put(`${this.baseUrl}/reassign-case`, {
            caseId,
            newAgentId,
            modifiedById,
        });
    }

    bulkReassignLeads(caseIds: string[], newAgentId: string, modifiedById: string) {
        return this.http.put(`${this.baseUrl}/bulk-reassign`, {
            caseIds,
            newAgentId,
            modifiedById,
        });
    }

    restoreFromDeadPool(caseId: string, modifiedById: string) {
        return this.http.put(`${this.baseUrl}/restore-from-dead-pool`, {
            caseId,
            modifiedById,
        });
    }
}
