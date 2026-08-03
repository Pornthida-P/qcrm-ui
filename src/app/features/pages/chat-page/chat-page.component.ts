import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
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

    user: User | null = null;
    queue: ChatConversation[] = [];
    conversations: ChatConversation[] = [];
    messages: ChatMessage[] = [];
    selected: ChatConversation | null = null;
    draft = '';
    loadingHistory = false;
    sending = false;
    chatEnabled = !!environment.features?.chatEnabled;
    templates: any[] = [];
    roomTags: any[] = [];
    tagDictionary: any[] = [];
    newTag = '';
    showTemplates = false;

    private subs: Subscription[] = [];

    constructor(
        private chatService: ChatService,
        private userService: UserService,
        private socketIoService: SocketIoService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        if (!this.chatEnabled) {
            this.router.navigate(['/home']);
            return;
        }

        this.subs.push(
            this.userService.getDataUser().subscribe((user) => {
                this.user = user;
                if (user?.userId) {
                    this.socketIoService.socket.emit('chat:join', user.userId);
                    this.refreshLists();
                    this.chatService.listTagDictionary().subscribe((tags) => (this.tagDictionary = tags || []));
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

    refreshLists(): void {
        if (!this.user?.userId) {
            return;
        }
        this.chatService.getQueue().subscribe((queue) => (this.queue = queue || []));
        this.chatService.getAgentConversations(this.user.userId).subscribe((list) => (this.conversations = list || []));
    }

    selectConversation(item: ChatConversation): void {
        this.selected = item;
        this.loadingHistory = true;
        this.showTemplates = false;
        this.chatService.listTemplates(item.channelType).subscribe((list) => (this.templates = list || []));
        this.chatService.listRoomTags(item.chatRoomId).subscribe((tags) => (this.roomTags = tags || []));
        this.chatService.getHistory(item.chatRoomId).subscribe({
            next: (messages) => {
                this.messages = messages || [];
                this.loadingHistory = false;
                this.scrollToBottom();
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

        const payload: ChatMessage = {
            chatRoomId: this.selected.chatRoomId,
            direction: 'out',
            messageType: 'text',
            messageText: text,
            channelKey: this.selected.channelKey,
            channelType: this.selected.channelType,
            channelName: this.selected.channelName,
            senderName: this.user.username,
            sender: {
                userId: this.user.userId,
                displayName: this.user.username,
            },
            receiver: {
                userId: this.selected.externalUserId,
                displayName: this.selected.displayName,
            },
            timestamp: Date.now(),
        };

        this.chatService.sendMessage(payload).subscribe({
            next: (saved) => {
                this.appendMessage(saved);
                this.sending = false;
                this.refreshLists();
            },
            error: () => {
                this.sending = false;
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
                this.refreshLists();
            },
        });
    }

    createCase(): void {
        if (!this.selected) {
            return;
        }
        const queryParams: Record<string, string> = {
            chatid: this.selected.chatRoomId,
            chattype: this.selected.channelType || this.selected.channelKey || '',
            displayName: this.selected.displayName || '',
            phone: this.selected.phoneNumber || '',
            issue: this.selected.issue || '',
            userId: this.selected.externalUserId || '',
        };
        this.router.navigate(['/contacts/phone'], { queryParams });
    }

    trackByRoom(_: number, item: ChatConversation): string {
        return item.chatRoomId;
    }

    trackByMessage(_: number, item: ChatMessage): string {
        return item.messageId || `${item.timestamp}-${item.messageText}`;
    }

    private bindSocket(): void {
        this.socketIoService.socket.on('chat:message', (message: ChatMessage) => {
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

    private appendMessage(message: ChatMessage): void {
        if (!message?.messageId) {
            this.messages = [...this.messages, message];
            this.scrollToBottom();
            return;
        }
        if (this.messages.some((m) => m.messageId === message.messageId)) {
            return;
        }
        this.messages = [...this.messages, message];
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            const el = this.messageList?.nativeElement;
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        });
    }
}
