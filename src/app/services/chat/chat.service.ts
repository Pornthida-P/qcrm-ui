import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';
import { ChatConversation, ChatMessage } from 'src/app/shared/interface/chat.interface';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private readonly baseUrl = `${environment.api.url}${config.api.path.chat.baseUrl}`;

    constructor(private http: HttpClient) {}

    getStatus(): Observable<{ enabled: boolean; maxActiveChatsPerAgent: number }> {
        return this.http.get(`${this.baseUrl}${config.api.path.chat.status}`).pipe(map((res) => this.parse(res)));
    }

    listChannels(): Observable<any[]> {
        return this.http.get(`${this.baseUrl}${config.api.path.chat.channels}`).pipe(map((res) => this.parse(res) || []));
    }

    saveChannel(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}${config.api.path.chat.channels}`, body).pipe(map((res) => this.parse(res)));
    }

    deleteChannel(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}${config.api.path.chat.channels}/${id}`).pipe(map((res) => this.parse(res)));
    }

    getQueue(channelKey?: string, agentUserId?: string): Observable<ChatConversation[]> {
        const params = new URLSearchParams();
        if (channelKey) {
            params.set('channelKey', channelKey);
        }
        if (agentUserId) {
            params.set('agentUserId', agentUserId);
        }
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.http.get(`${this.baseUrl}${config.api.path.chat.queue}${query}`).pipe(map((res) => this.parse(res) || []));
    }

    getAgentConversations(agentUserId: string): Observable<ChatConversation[]> {
        return this.http
            .get(`${this.baseUrl}${config.api.path.chat.conversations}/${agentUserId}`)
            .pipe(map((res) => this.parse(res) || []));
    }

    getConversation(chatRoomId: string): Observable<ChatConversation | null> {
        return this.http
            .get(`${this.baseUrl}${config.api.path.chat.conversation}/${encodeURIComponent(chatRoomId)}`)
            .pipe(map((res) => this.parse(res) || null));
    }

    getHistory(chatRoomId: string, includeMonitor = false): Observable<ChatMessage[]> {
        return this.http
            .post(`${this.baseUrl}${config.api.path.chat.history}`, { chatRoomId, includeMonitor })
            .pipe(map((res) => this.parse(res) || []));
    }

    sendMessage(message: ChatMessage): Observable<ChatMessage> {
        return this.http.post(`${this.baseUrl}${config.api.path.chat.message}`, message).pipe(map((res) => this.parse(res)));
    }

    assignChat(body: {
        chatRoomId: string;
        agentUserId: string;
        assignByUserId?: string;
        assignByDisplayName?: string;
        fromAgentUserId?: string;
        note?: string;
    }): Observable<ChatConversation> {
        return this.http.post(`${this.baseUrl}${config.api.path.chat.assign}`, body).pipe(map((res) => this.parse(res)));
    }

    endChat(body: { chatRoomId: string; agentUserId?: string }): Observable<ChatConversation> {
        return this.http.post(`${this.baseUrl}${config.api.path.chat.end}`, body).pipe(map((res) => this.parse(res)));
    }

    markRead(body: { chatRoomId: string; agentUserId?: string }): Observable<{ success: boolean }> {
        return this.http.post(`${this.baseUrl}${config.api.path.chat.read}`, body).pipe(map((res) => this.parse(res)));
    }

    // Phase 2
    getDashboard(): Observable<any> {
        return this.http.get(`${this.baseUrl}/dashboard`).pipe(map((res) => this.parse(res)));
    }

    getMonitorConversations(): Observable<ChatConversation[]> {
        return this.http.get(`${this.baseUrl}/monitor/conversations`).pipe(map((res) => this.parse(res) || []));
    }

    getReportSummary(startTs: number, endTs: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/reports/summary?startTs=${startTs}&endTs=${endTs}`).pipe(map((res) => this.parse(res)));
    }

    listSchedules(channelKey?: string): Observable<any[]> {
        const q = channelKey ? `?channelKey=${encodeURIComponent(channelKey)}` : '';
        return this.http.get(`${this.baseUrl}/schedules${q}`).pipe(map((res) => this.parse(res) || []));
    }

    saveSchedule(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/schedules`, body).pipe(map((res) => this.parse(res)));
    }

    deleteSchedule(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/schedules/${id}`).pipe(map((res) => this.parse(res)));
    }

    listAutoMessages(tagName?: string): Observable<any[]> {
        const q = tagName ? `?tagName=${encodeURIComponent(tagName)}` : '';
        return this.http.get(`${this.baseUrl}/auto-messages${q}`).pipe(map((res) => this.parse(res) || []));
    }

    saveAutoMessage(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/auto-messages`, body).pipe(map((res) => this.parse(res)));
    }

    deleteAutoMessage(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/auto-messages/${id}`).pipe(map((res) => this.parse(res)));
    }

    listEndMessages(): Observable<any[]> {
        return this.http.get(`${this.baseUrl}/end-messages`).pipe(map((res) => this.parse(res) || []));
    }

    saveEndMessage(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/end-messages`, body).pipe(map((res) => this.parse(res)));
    }

    listTemplates(channelType?: string, all = false): Observable<any[]> {
        const params = all ? '?all=1' : channelType ? `?channelType=${encodeURIComponent(channelType)}` : '';
        return this.http.get(`${this.baseUrl}/templates${params}`).pipe(map((res) => this.parse(res) || []));
    }

    saveTemplate(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/templates`, body).pipe(map((res) => this.parse(res)));
    }

    deleteTemplate(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/templates/${id}`).pipe(map((res) => this.parse(res)));
    }

    listTagDictionary(): Observable<any[]> {
        return this.http.get(`${this.baseUrl}/tag-dictionary`).pipe(map((res) => this.parse(res) || []));
    }

    saveTagDictionary(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/tag-dictionary`, body).pipe(map((res) => this.parse(res)));
    }

    deleteTagDictionary(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/tag-dictionary/${id}`).pipe(map((res) => this.parse(res)));
    }

    listRoomTags(chatRoomId: string): Observable<any[]> {
        return this.http.get(`${this.baseUrl}/tags/${encodeURIComponent(chatRoomId)}`).pipe(map((res) => this.parse(res) || []));
    }

    addRoomTag(body: { chatRoomId: string; tagName: string; externalUserId?: string; createdById?: string }): Observable<any> {
        return this.http.post(`${this.baseUrl}/tags`, body).pipe(map((res) => this.parse(res)));
    }

    removeRoomTag(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/tags/${id}`).pipe(map((res) => this.parse(res)));
    }

    listBadwords(): Observable<any[]> {
        return this.http.get(`${this.baseUrl}/badwords`).pipe(map((res) => this.parse(res) || []));
    }

    saveBadword(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/badwords`, body).pipe(map((res) => this.parse(res)));
    }

    deleteBadword(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/badwords/${id}`).pipe(map((res) => this.parse(res)));
    }

    // Phase 3 — Broadcast
    listBroadcasts(): Observable<any[]> {
        return this.http.get(`${this.baseUrl}/broadcasts`).pipe(map((res) => this.parse(res) || []));
    }

    createBroadcast(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/broadcasts`, body).pipe(map((res) => this.parse(res)));
    }

    cancelBroadcast(id: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/broadcasts/${id}/cancel`, {}).pipe(map((res) => this.parse(res)));
    }

    deleteBroadcast(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/broadcasts/${id}`).pipe(map((res) => this.parse(res)));
    }

    // Phase 3 — Bot
    listBotCategories(): Observable<any[]> {
        return this.http.get(`${this.baseUrl}/bot/categories`).pipe(map((res) => this.parse(res) || []));
    }

    saveBotCategory(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/bot/categories`, body).pipe(map((res) => this.parse(res)));
    }

    deleteBotCategory(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/bot/categories/${id}`).pipe(map((res) => this.parse(res)));
    }

    listBotKeywords(): Observable<any[]> {
        return this.http.get(`${this.baseUrl}/bot/keywords`).pipe(map((res) => this.parse(res) || []));
    }

    saveBotKeyword(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/bot/keywords`, body).pipe(map((res) => this.parse(res)));
    }

    deleteBotKeyword(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/bot/keywords/${id}`).pipe(map((res) => this.parse(res)));
    }

    listBotResponses(keywordGroupId?: number): Observable<any[]> {
        const q = keywordGroupId ? `?keywordGroupId=${keywordGroupId}` : '';
        return this.http.get(`${this.baseUrl}/bot/responses${q}`).pipe(map((res) => this.parse(res) || []));
    }

    saveBotResponse(body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/bot/responses`, body).pipe(map((res) => this.parse(res)));
    }

    deleteBotResponse(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/bot/responses/${id}`).pipe(map((res) => this.parse(res)));
    }

    matchBot(messageText: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/bot/match`, { messageText }).pipe(map((res) => this.parse(res)));
    }

    private parse(res: any): any {
        if (typeof res === 'string') {
            try {
                return JSON.parse(res);
            } catch {
                return res;
            }
        }
        return res;
    }
}
