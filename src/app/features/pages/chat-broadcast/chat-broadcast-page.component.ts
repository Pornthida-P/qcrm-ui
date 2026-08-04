import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { canAccessChatNav } from '../chat-page/chat-access';

@Component({
    selector: 'app-chat-broadcast-page',
    templateUrl: './chat-broadcast-page.component.html',
})
export class ChatBroadcastPageComponent implements OnInit {
    broadcasts: any[] = [];
    tags: any[] = [];
    userId = '';
    form: any = {
        broadcastName: '',
        scheduledAt: '',
        channelKeys: '',
        tagFilter: '',
        messageText: '',
    };

    constructor(
        private chatService: ChatService,
        private userService: UserService,
        private router: Router,
        private translate: TranslateService,
    ) {}

    ngOnInit(): void {
        if (!environment.features?.chatEnabled) {
            this.router.navigate(['/home']);
            return;
        }
        this.userService.getDataUser().subscribe((u) => {
            if (!canAccessChatNav('broadcast', u)) {
                this.router.navigate(['/chat']);
                return;
            }
            this.userId = u?.userId || '';
            this.reload();
            this.chatService.listTagDictionary().subscribe((t) => (this.tags = t || []));
        });
    }

    reload(): void {
        this.chatService.listBroadcasts().subscribe((list) => (this.broadcasts = list || []));
    }

    create(): void {
        if (!this.form.broadcastName?.trim() || !this.form.messageText?.trim() || !this.form.scheduledAt) {
            return;
        }
        const channels = String(this.form.channelKeys || '')
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
            .map((channelKey: string) => ({ channelKey }));
        const tags = String(this.form.tagFilter || '')
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);

        this.chatService
            .createBroadcast({
                broadcastName: this.form.broadcastName,
                scheduledAt: this.form.scheduledAt.replace('T', ' ') + ':00',
                broadcastChannels: channels,
                broadcastFilter: tags.length ? { tags } : null,
                messages: [{ messageType: 'text', messageText: this.form.messageText }],
                createdById: this.userId,
            })
            .subscribe(() => {
                this.form = { broadcastName: '', scheduledAt: '', channelKeys: '', tagFilter: '', messageText: '' };
                this.reload();
            });
    }

    cancel(id: number): void {
        this.chatService.cancelBroadcast(id).subscribe(() => this.reload());
    }

    remove(id: number): void {
        this.chatService.deleteBroadcast(id).subscribe(() => this.reload());
    }

    statusLabel(isSent: number): string {
        if (isSent === 1) return this.translate.instant('chat.status.sent');
        if (isSent === 2) return this.translate.instant('chat.status.cancelled');
        return this.translate.instant('chat.status.pending');
    }
}
