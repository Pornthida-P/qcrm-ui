import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, tap } from 'rxjs';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
import { StatusService } from 'src/app/services/status/status.service';
import { UserService } from 'src/app/services/user/user.service';
import { ChatConversation, ChatMessage } from 'src/app/shared/interface/chat.interface';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-chat-page',
    templateUrl: './chat-page.component.html',
    styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent implements OnInit, OnDestroy {
    @ViewChild('messageList') messageList?: ElementRef<HTMLDivElement>;
    @ViewChild('monitorList') monitorList?: ElementRef<HTMLDivElement>;
    @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

    user: User | null = null;
    queue: ChatConversation[] = [];
    conversations: ChatConversation[] = [];
    messages: ChatMessage[] = [];
    monitorMessages: ChatMessage[] = [];
    selected: ChatConversation | null = null;
    draft = '';
    monitorDraft = '';
    loadingHistory = false;
    sending = false;
    sendingMonitor = false;
    uploading = false;
    chatEnabled = !!environment.features?.chatEnabled;
    templates: any[] = [];
    roomTags: any[] = [];
    tagDictionary: any[] = [];
    newTag = '';
    showTemplates = false;
    showCasePanel = false;
    showSupervisorPanel = false;
    caseConversation: ChatConversation | null = null;
    queueCollapsed = false;
    myChatsCollapsed = false;
    queueSearch = '';
    myChatsSearch = '';

    showTransferModal = false;
    activeAgents: Array<{ userId: string; username: string }> = [];
    selectedTransferAgentId = '';
    transferring = false;
    loadingAgents = false;

    private subs: Subscription[] = [];
    private notiAudio?: HTMLAudioElement;
    private pendingChatRoomId: string | null = null;

    constructor(
        private chatService: ChatService,
        private userService: UserService,
        private socketIoService: SocketIoService,
        private router: Router,
        private route: ActivatedRoute,
        public statusService: StatusService,
        private attachmentService: AttachmentService,
        private callListService: CallListService,
        private translate: TranslateService,
    ) {}

    ngOnInit(): void {
        if (!this.chatEnabled) {
            this.router.navigate(['/home']);
            return;
        }

        this.notiAudio = new Audio('assets/sounds/short_notification.mp3');
        this.notiAudio.preload = 'auto';

        this.subs.push(
            this.route.queryParamMap.subscribe((params) => {
                const chatRoomId = (params.get('chatRoomId') || '').trim();
                this.pendingChatRoomId = chatRoomId || null;
                if (this.pendingChatRoomId && this.user?.userId) {
                    this.openDeepLinkedConversation(this.pendingChatRoomId);
                }
            }),
        );

        this.subs.push(
            this.userService.getDataUser().subscribe((user) => {
                this.user = user;
                if (user?.userId) {
                    this.socketIoService.socket.emit('chat:join', user.userId);
                    this.refreshLists();
                    this.chatService.listTagDictionary().subscribe((tags) => (this.tagDictionary = tags || []));
                    if (this.pendingChatRoomId) {
                        this.openDeepLinkedConversation(this.pendingChatRoomId);
                    }
                }
            }),
        );

        this.bindSocket();
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => s.unsubscribe());
        this.socketIoService.socket.off('chat:message');
        this.socketIoService.socket.off('chat:queue');
        this.socketIoService.socket.off('chat:conversation');
        this.socketIoService.socket.off('chat:conversations');
        this.socketIoService.socket.off('chat:error');
    }

    get filteredQueue(): ChatConversation[] {
        return this.filterConversations(this.queue, this.queueSearch);
    }

    get filteredConversations(): ChatConversation[] {
        return this.filterConversations(this.conversations, this.myChatsSearch);
    }

    refreshLists(): void {
        if (!this.user?.userId) {
            return;
        }
        this.chatService.getQueue(undefined, this.user.userId).subscribe((queue) => (this.queue = queue || []));
        this.chatService.getAgentConversations(this.user.userId).subscribe((list) => (this.conversations = list || []));
    }

    selectConversation(item: ChatConversation): void {
        this.selected = item;
        if (this.showCasePanel && this.caseConversation?.chatRoomId !== item.chatRoomId) {
            this.caseConversation = item;
        }
        this.loadingHistory = true;
        this.showTemplates = false;
        this.messages = [];
        this.monitorMessages = [];
        this.chatService.listTemplates(item.channelType).subscribe((list) => (this.templates = list || []));
        this.chatService.listRoomTags(item.chatRoomId).subscribe((tags) => (this.roomTags = tags || []));
        this.chatService.getHistory(item.chatRoomId, true).subscribe({
            next: (messages) => {
                const all = messages || [];
                this.messages = all.filter((m) => !this.isMonitorMessage(m));
                this.monitorMessages = all.filter((m) => this.isMonitorMessage(m));
                this.loadingHistory = false;
                this.scrollToBottom();
                this.scrollMonitorToBottom();
                if (this.user?.userId) {
                    this.chatService.markRead({ chatRoomId: item.chatRoomId, agentUserId: this.user.userId }).subscribe(() => {
                        this.refreshLists();
                    });
                }
            },
            error: () => {
                this.loadingHistory = false;
            },
        });
    }

    applyTemplate(template: any): void {
        if (template?.messageText) {
            this.draft = template.messageText;
            this.showTemplates = false;
        }
    }

    addTag(): void {
        if (!this.selected || !this.newTag.trim()) {
            return;
        }
        this.chatService
            .addRoomTag({
                chatRoomId: this.selected.chatRoomId,
                tagName: this.newTag.trim(),
                externalUserId: this.selected.externalUserId,
                createdById: this.user?.userId,
            })
            .subscribe(() => {
                this.newTag = '';
                this.chatService.listRoomTags(this.selected!.chatRoomId).subscribe((tags) => (this.roomTags = tags || []));
                this.chatService.listTagDictionary().subscribe((tags) => (this.tagDictionary = tags || []));
            });
    }

    removeTag(tag: any): void {
        if (!tag?.id) {
            return;
        }
        this.chatService.removeRoomTag(tag.id).subscribe(() => {
            this.roomTags = this.roomTags.filter((t) => t.id !== tag.id);
        });
    }

    takeFromQueue(item: ChatConversation): void {
        if (!this.user?.userId) {
            return;
        }
        this.chatService
            .assignChat({
                chatRoomId: item.chatRoomId,
                agentUserId: this.user.userId,
                assignByUserId: this.user.userId,
                assignByDisplayName: this.user.username,
            })
            .subscribe({
                next: (conversation) => {
                    this.refreshLists();
                    this.selectConversation(conversation);
                },
            });
    }

    send(): void {
        if (!this.selected || !this.user || !this.draft.trim() || this.sending) {
            return;
        }
        const text = this.draft.trim();
        this.draft = '';
        this.sending = true;
        this.sendChatMessage({
            messageType: 'text',
            messageText: text,
        }).subscribe({
            next: () => {
                this.sending = false;
            },
            error: () => {
                this.sending = false;
            },
        });
    }

    openFilePicker(): void {
        this.fileInput?.nativeElement?.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file || !this.selected || !this.user || this.uploading) {
            return;
        }

        this.uploading = true;
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        this.attachmentService.upload(file, file.name, createdAt, this.user.userId).subscribe({
            next: (response: any) => {
                const publicUrl = `${environment.api.url}${response.filepath}`;
                const messageType = this.detectMessageType(file);
                const messageData = this.buildMessageData(messageType, publicUrl, file);
                this.sendChatMessage({
                    messageType,
                    messageText: this.mediaPreviewText(messageType, file.name),
                    messageData,
                }).subscribe({
                    next: () => {
                        this.uploading = false;
                    },
                    error: () => {
                        this.uploading = false;
                    },
                });
            },
            error: () => {
                this.uploading = false;
            },
        });
    }

    openTransferModal(): void {
        if (!this.selected || !this.user) {
            return;
        }
        this.showTransferModal = true;
        this.selectedTransferAgentId = '';
        this.loadingAgents = true;
        this.callListService.getActiveAgents().subscribe({
            next: (res: any) => {
                const agents = Array.isArray(res) ? res : [];
                this.activeAgents = agents.filter((a: any) => a.userId && a.userId !== this.user?.userId);
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
                fromAgentUserId: this.user.userId,
                assignByUserId: this.user.userId,
                assignByDisplayName: this.user.username,
            })
            .subscribe({
                next: () => {
                    this.closeTransferModal();
                    this.selected = null;
                    this.messages = [];
                    this.monitorMessages = [];
                    this.showSupervisorPanel = false;
                    this.closeCasePanel();
                    this.refreshLists();
                },
                error: () => {
                    this.transferring = false;
                },
            });
    }

    toggleSupervisorPanel(): void {
        this.showSupervisorPanel = !this.showSupervisorPanel;
        if (this.showSupervisorPanel) {
            this.scrollMonitorToBottom();
        }
    }

    sendToSupervisor(): void {
        if (!this.selected || !this.user || !this.monitorDraft.trim() || this.sendingMonitor) {
            return;
        }
        const text = this.monitorDraft.trim();
        this.monitorDraft = '';
        this.sendingMonitor = true;
        this.chatService
            .sendMessage({
                chatRoomId: this.selected.chatRoomId,
                direction: 'out',
                messageType: 'text',
                messageText: text,
                secretType: 'monitor',
                channelKey: this.selected.channelKey,
                channelType: this.selected.channelType,
                channelName: this.selected.channelName,
                senderName: this.user.username,
                sender: {
                    userId: this.user.userId,
                    displayName: this.user.username,
                },
                timestamp: Date.now(),
            })
            .subscribe({
                next: (saved) => {
                    this.appendMessage(saved);
                    this.sendingMonitor = false;
                },
                error: () => {
                    this.sendingMonitor = false;
                },
            });
    }

    forwardToSupervisor(message: ChatMessage): void {
        if (!this.selected || !this.user || this.sendingMonitor) {
            return;
        }
        const body = message.messageText || this.mediaPreviewText(message.messageType);
        if (!body) {
            return;
        }
        this.showSupervisorPanel = true;
        this.sendingMonitor = true;
        const quoted = `[Forwarded from customer]\n${body}`;
        this.chatService
            .sendMessage({
                chatRoomId: this.selected.chatRoomId,
                direction: 'out',
                messageType: 'text',
                messageText: quoted,
                secretType: 'monitor',
                channelKey: this.selected.channelKey,
                channelType: this.selected.channelType,
                channelName: this.selected.channelName,
                senderName: this.user.username,
                sender: {
                    userId: this.user.userId,
                    displayName: this.user.username,
                },
                timestamp: Date.now(),
            })
            .subscribe({
                next: (saved) => {
                    this.appendMessage(saved);
                    this.sendingMonitor = false;
                },
                error: () => {
                    this.sendingMonitor = false;
                },
            });
    }

    endChat(): void {
        if (!this.selected || !this.user?.userId) {
            return;
        }
        this.chatService.endChat({ chatRoomId: this.selected.chatRoomId, agentUserId: this.user.userId }).subscribe({
            next: () => {
                this.selected = null;
                this.messages = [];
                this.monitorMessages = [];
                this.showSupervisorPanel = false;
                this.closeCasePanel();
                this.refreshLists();
            },
        });
    }

    createCase(): void {
        if (!this.selected) {
            return;
        }
        if (this.showCasePanel && this.caseConversation?.chatRoomId === this.selected.chatRoomId) {
            this.closeCasePanel();
            return;
        }
        this.caseConversation = this.selected;
        this.showCasePanel = true;
    }

    closeCasePanel(): void {
        this.showCasePanel = false;
        this.caseConversation = null;
    }

    onCaseSaved(): void {
        this.closeCasePanel();
    }

    trackByRoom(_: number, item: ChatConversation): string {
        return item.chatRoomId;
    }

    trackByMessage(_: number, item: ChatMessage): string {
        return item.messageId || `${item.timestamp}-${item.messageText}`;
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

    isSystemMessage(message: ChatMessage): boolean {
        const type = (message.messageType || '').toLowerCase();
        const text = (message.messageText || '').toLowerCase();
        return type === 'system' || this.isSystemMessageText(text);
    }

    private isSystemMessageText(text: string): boolean {
        const normalized = (text || '').toLowerCase().trim();
        return normalized === 'assignchat' || normalized === 'endchat';
    }

    isMonitorMessage(message: ChatMessage): boolean {
        return (message.secretType || '').toLowerCase() === 'monitor';
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
        return data.file_name || data.fileName || message.messageText || this.translate.instant('chat.download-file');
    }

    openMedia(message: ChatMessage): void {
        const src = this.mediaSrc(message);
        if (src) {
            window.open(src, '_blank');
        }
    }

    private openDeepLinkedConversation(chatRoomId: string): void {
        if (!chatRoomId) {
            return;
        }
        if (this.selected?.chatRoomId === chatRoomId) {
            this.pendingChatRoomId = null;
            this.clearChatRoomQueryParam();
            return;
        }

        this.chatService.getConversation(chatRoomId).subscribe({
            next: (conversation) => {
                const item: ChatConversation = conversation?.chatRoomId
                    ? conversation
                    : {
                          chatRoomId,
                          displayName: chatRoomId,
                          status: 'ended',
                      };
                this.selectConversation(item);
                this.pendingChatRoomId = null;
                this.clearChatRoomQueryParam();
            },
            error: () => {
                this.selectConversation({
                    chatRoomId,
                    displayName: chatRoomId,
                    status: 'ended',
                });
                this.pendingChatRoomId = null;
                this.clearChatRoomQueryParam();
            },
        });
    }

    private clearChatRoomQueryParam(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { chatRoomId: null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    private sendChatMessage(partial: Partial<ChatMessage>): Observable<ChatMessage> {
        const payload: ChatMessage = {
            chatRoomId: this.selected!.chatRoomId,
            direction: 'out',
            messageType: partial.messageType || 'text',
            messageText: partial.messageText || '',
            messageData: partial.messageData,
            secretType: 'public',
            channelKey: this.selected!.channelKey,
            channelType: this.selected!.channelType,
            channelName: this.selected!.channelName,
            senderName: this.user!.username,
            sender: {
                userId: this.user!.userId,
                displayName: this.user!.username,
            },
            receiver: {
                userId: this.selected!.externalUserId,
                displayName: this.selected!.displayName,
            },
            timestamp: Date.now(),
        };

        return this.chatService.sendMessage(payload).pipe(
            tap((saved) => {
                this.appendMessage(saved);
                this.refreshLists();
            }),
        );
    }

    private detectMessageType(file: File): string {
        const mime = (file.type || '').toLowerCase();
        if (mime.startsWith('image/')) {
            return 'image';
        }
        if (mime.startsWith('video/')) {
            return 'video';
        }
        if (mime.startsWith('audio/')) {
            return 'audio';
        }
        return 'file';
    }

    private buildMessageData(messageType: string, publicUrl: string, file: File): Record<string, unknown> {
        if (messageType === 'image') {
            return {
                type: 'image',
                originalContentUrl: publicUrl,
                previewImageUrl: publicUrl,
            };
        }
        if (messageType === 'video') {
            return {
                type: 'video',
                originalContentUrl: publicUrl,
            };
        }
        if (messageType === 'audio') {
            return {
                type: 'audio',
                originalContentUrl: publicUrl,
            };
        }
        return {
            type: 'document',
            originalContentUrl: publicUrl,
            file_name: file.name,
            file_type: file.type,
            fileName: file.name,
            fileType: file.type,
        };
    }

    private mediaPreviewText(messageType?: string, fileName?: string): string {
        const type = (messageType || '').toLowerCase();
        if (type === 'image') return this.translate.instant('chat.media.image');
        if (type === 'video') return this.translate.instant('chat.media.video');
        if (type === 'audio') return this.translate.instant('chat.media.audio');
        if (type === 'sticker') return this.translate.instant('chat.media.sticker');
        if (type === 'file' || type === 'document') {
            const fileLabel = this.translate.instant('chat.media.file');
            return fileName ? `${fileLabel} ${fileName}` : fileLabel;
        }
        return fileName || '';
    }

    private filterConversations(list: ChatConversation[], query: string): ChatConversation[] {
        const q = (query || '').trim().toLowerCase();
        if (!q) {
            return list;
        }
        return list.filter((item) => {
            const haystack = [
                item.displayName,
                item.chatRoomId,
                item.phoneNumber,
                item.lastMessage,
                item.channelName,
                item.channelType,
                item.channelKey,
                item.externalUserId,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }

    private bindSocket(): void {
        this.socketIoService.socket.on('chat:message', (message: ChatMessage) => {
            if (
                message.direction === 'in' &&
                !this.isMonitorMessage(message) &&
                !this.isSystemMessage(message)
            ) {
                this.playNotiSound();
            }
            if (this.selected?.chatRoomId === message.chatRoomId) {
                this.appendMessage(message);
            }
            this.refreshLists();
        });
        this.socketIoService.socket.on('chat:queue', (queue: ChatConversation[]) => {
            this.queue = queue || [];
        });
        this.socketIoService.socket.on('chat:conversation', () => this.refreshLists());
        this.socketIoService.socket.on('chat:conversations', (list: ChatConversation[]) => {
            this.conversations = list || [];
        });
    }

    private playNotiSound(): void {
        if (!this.notiAudio) {
            return;
        }
        try {
            this.notiAudio.currentTime = 0;
            void this.notiAudio.play().catch(() => {});
        } catch {
            // autoplay may be blocked until user interacts
        }
    }

    private appendMessage(message: ChatMessage): void {
        if (this.isMonitorMessage(message)) {
            this.appendToList('monitorMessages', message);
            this.scrollMonitorToBottom();
            return;
        }
        this.appendToList('messages', message);
        this.scrollToBottom();
    }

    private appendToList(key: 'messages' | 'monitorMessages', message: ChatMessage): void {
        const list = this[key];
        if (!message?.messageId) {
            this[key] = [...list, message];
            return;
        }
        if (list.some((m) => m.messageId === message.messageId)) {
            return;
        }
        this[key] = [...list, message];
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            const el = this.messageList?.nativeElement;
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        });
    }

    private scrollMonitorToBottom(): void {
        setTimeout(() => {
            const el = this.monitorList?.nativeElement;
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        });
    }
}
