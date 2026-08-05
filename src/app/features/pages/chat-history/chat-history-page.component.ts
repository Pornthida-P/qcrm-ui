import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { StatusService } from 'src/app/services/status/status.service';
import { UserService } from 'src/app/services/user/user.service';
import { ChatConversation, ChatMessage } from 'src/app/shared/interface/chat.interface';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';
import { canAccessChatNav, isChatPrivileged } from '../chat-page/chat-access';

@Component({
    selector: 'app-chat-history-page',
    templateUrl: './chat-history-page.component.html',
    styleUrl: './chat-history-page.component.scss',
})
export class ChatHistoryPageComponent implements OnInit, OnDestroy {
    user: User | null = null;
    conversations: ChatConversation[] = [];
    selected: ChatConversation | null = null;
    messages: ChatMessage[] = [];
    selectedDate = '';
    loading = false;
    search = '';

    showTransferModal = false;
    loadingAgents = false;
    transferring = false;
    selectedTransferAgentId = '';
    activeAgents: Array<{ userId: string; username: string }> = [];

    get canTransfer(): boolean {
        return isChatPrivileged(this.user);
    }

    get filteredConversations(): ChatConversation[] {
        const q = this.search.trim().toLowerCase();
        if (!q) {
            return this.conversations;
        }
        return this.conversations.filter((item) => {
            const hay = [
                item.displayName,
                item.chatRoomId,
                item.lastMessage,
                item.channelName,
                item.channelType,
                item.agentUsername,
                item.agentUserId,
                item.status,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return hay.includes(q);
        });
    }

    constructor(
        private chatService: ChatService,
        private callListService: CallListService,
        private userService: UserService,
        private router: Router,
        private translate: TranslateService,
        public statusService: StatusService,
    ) {}

    ngOnInit(): void {
        if (!environment.features?.chatEnabled) {
            this.router.navigate(['/home']);
            return;
        }
        this.selectedDate = this.toDateInputValue(new Date());
        this.userService.getDataUser().subscribe((u) => {
            this.user = u;
            if (!canAccessChatNav('history', u)) {
                this.router.navigate(['/chat']);
                return;
            }
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        // no socket subscriptions
    }

    refresh(): void {
        this.loading = true;
        this.chatService.getDailyHistory(this.selectedDate).subscribe({
            next: (list) => {
                this.conversations = list || [];
                this.loading = false;
                if (this.selected) {
                    const still = this.conversations.find((c) => c.chatRoomId === this.selected?.chatRoomId);
                    if (still) {
                        this.selected = still;
                    } else {
                        this.selected = null;
                        this.messages = [];
                    }
                }
            },
            error: () => {
                this.conversations = [];
                this.loading = false;
            },
        });
    }

    onDateChange(): void {
        this.selected = null;
        this.messages = [];
        this.refresh();
    }

    select(item: ChatConversation): void {
        this.selected = item;
        this.chatService.getHistory(item.chatRoomId, true).subscribe((messages) => (this.messages = messages || []));
    }

    trackByRoom(_: number, item: ChatConversation): string {
        return item.chatRoomId;
    }

    trackByMessage(_: number, item: ChatMessage): string {
        return item.messageId || String(item.id || item.timestamp || _);
    }

    channelLabel(item: ChatConversation | null | undefined): string {
        if (!item) {
            return '';
        }
        return item.channelName || item.channelType || item.channelKey || '';
    }

    avatarUrl(item: ChatConversation | null | undefined): string {
        const url = item?.pictureUrl;
        if (!url) {
            return '';
        }
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }
        return `${environment.api.url}${url.startsWith('/') ? url : `/${url}`}`;
    }

    avatarInitial(item: ChatConversation | null | undefined): string {
        const name = (item?.displayName || item?.chatRoomId || '?').trim();
        return name.charAt(0).toUpperCase();
    }

    statusClass(status?: string): string {
        switch ((status || '').toLowerCase()) {
            case 'queue':
                return 'text-bg-secondary';
            case 'assigned':
                return 'text-bg-primary';
            case 'ended':
                return 'text-bg-dark';
            default:
                return 'text-bg-light';
        }
    }

    activityTime(item: ChatConversation): number | null {
        const n = Number(item.lastMessageTime || item.startTime || item.startWaitTime || item.endTime || 0);
        return n || null;
    }

    isSystemMessage(message: ChatMessage): boolean {
        const type = (message.messageType || '').toLowerCase();
        const text = (message.messageText || '').toLowerCase();
        return type === 'system' || this.isSystemMessageText(text);
    }

    systemMessageLabel(message: ChatMessage): string {
        const text = (message.messageText || '').toLowerCase().trim();
        if (text === 'assignchat') {
            const by = message.senderName && message.senderName !== 'system' ? ` · ${message.senderName}` : '';
            return `${this.translate.instant('chat.assigned')}${by}`;
        }
        if (text === 'endchat') {
            return this.translate.instant('chat.ended');
        }
        return message.messageText || this.translate.instant('chat.system');
    }

    openTransferModal(): void {
        if (!this.selected || !this.canTransfer) {
            return;
        }
        this.showTransferModal = true;
        this.selectedTransferAgentId = '';
        this.loadingAgents = true;
        this.callListService.getActiveAgents().subscribe({
            next: (res: any) => {
                const agents = Array.isArray(res) ? res : [];
                this.activeAgents = agents.filter((a: any) => a.userId);
                this.loadingAgents = false;
            },
            error: () => {
                this.activeAgents = [];
                this.loadingAgents = false;
            },
        });
    }

    closeTransferModal(): void {
        this.showTransferModal = false;
        this.selectedTransferAgentId = '';
        this.transferring = false;
    }

    confirmTransfer(): void {
        if (!this.selected || !this.user?.userId || !this.selectedTransferAgentId || this.transferring) {
            return;
        }
        this.transferring = true;
        this.chatService
            .assignChat({
                chatRoomId: this.selected.chatRoomId,
                agentUserId: this.selectedTransferAgentId,
                fromAgentUserId: this.selected.agentUserId || undefined,
                assignByUserId: this.user.userId,
                assignByDisplayName: this.user.username,
            })
            .subscribe({
                next: () => {
                    this.closeTransferModal();
                    this.refresh();
                },
                error: () => {
                    this.transferring = false;
                },
            });
    }

    messageTypeOf(message: ChatMessage): string {
        return (message.messageType || 'text').toLowerCase();
    }

    resolveMessageData(message: ChatMessage): any {
        let data = message.messageData;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch {
                data = {};
            }
        }
        data = data || {};
        if (this.messageTypeOf(message) === 'sticker' && !data.originalContentUrl) {
            const stickerId = data.sticker_id || data.stickerId;
            if (stickerId) {
                data = {
                    ...data,
                    originalContentUrl: `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerId}/android/sticker.png`,
                };
            }
        }
        return data;
    }

    mediaSrc(message: ChatMessage): string {
        const data = this.resolveMessageData(message);
        const url = data.originalContentUrl || data.previewImageUrl || data.url || '';
        if (!url) {
            return '';
        }
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }
        return `${environment.api.url}${url.startsWith('/') ? url : `/${url}`}`;
    }

    fileName(message: ChatMessage): string {
        const data = this.resolveMessageData(message);
        return data.file_name || data.fileName || message.messageText || 'file';
    }

    openMedia(message: ChatMessage): void {
        const src = this.mediaSrc(message);
        if (src) {
            window.open(src, '_blank');
        }
    }

    private isSystemMessageText(text: string): boolean {
        const normalized = (text || '').toLowerCase().trim();
        return normalized === 'assignchat' || normalized === 'endchat';
    }

    private toDateInputValue(d: Date): string {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
}
