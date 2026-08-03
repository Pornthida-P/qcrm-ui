import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
import { ChatConversation, ChatMessage } from 'src/app/shared/interface/chat.interface';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-chat-monitor-page',
    templateUrl: './chat-monitor-page.component.html',
    styleUrl: './chat-monitor-page.component.scss',
})
export class ChatMonitorPageComponent implements OnInit, OnDestroy {
    conversations: ChatConversation[] = [];
    selected: ChatConversation | null = null;
    messages: ChatMessage[] = [];
    whisper = '';
    private sub?: Subscription;

    constructor(
        private chatService: ChatService,
        private socketIoService: SocketIoService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        if (!environment.features?.chatEnabled) {
            this.router.navigate(['/home']);
            return;
        }
        this.refresh();
        this.socketIoService.socket.on('chat:conversation', () => this.refresh());
        this.socketIoService.socket.on('chat:message', (msg: ChatMessage) => {
            if (this.selected?.chatRoomId === msg.chatRoomId) {
                if (!this.messages.some((m) => m.messageId && m.messageId === msg.messageId)) {
                    this.messages = [...this.messages, msg];
                }
            }
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.socketIoService.socket.off('chat:conversation');
        this.socketIoService.socket.off('chat:message');
    }

    refresh(): void {
        this.chatService.getMonitorConversations().subscribe((list) => (this.conversations = list || []));
    }

    select(item: ChatConversation): void {
        this.selected = item;
        this.chatService.getHistory(item.chatRoomId, true).subscribe((messages) => (this.messages = messages || []));
    }

    sendWhisper(): void {
        if (!this.selected || !this.whisper.trim()) {
            return;
        }
        const text = this.whisper.trim();
        this.whisper = '';
        this.chatService
            .sendMessage({
                chatRoomId: this.selected.chatRoomId,
                direction: 'out',
                messageType: 'text',
                messageText: text,
                secretType: 'monitor',
                channelKey: this.selected.channelKey,
                channelType: this.selected.channelType,
                senderName: 'supervisor',
                timestamp: Date.now(),
            })
            .subscribe((saved) => {
                this.messages = [...this.messages, saved];
            });
    }
}
