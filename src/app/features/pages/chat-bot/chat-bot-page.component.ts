import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { canAccessChatNav } from '../chat-page/chat-access';

@Component({
    selector: 'app-chat-bot-page',
    templateUrl: './chat-bot-page.component.html',
})
export class ChatBotPageComponent implements OnInit {
    categories: any[] = [];
    keywords: any[] = [];
    responses: any[] = [];
    userId = '';

    categoryForm: any = {};
    keywordForm: any = { isActive: 1 };
    responseForm: any = { messageType: 'text', messageIndex: 0 };
    testText = '';
    testResult: any = null;

    constructor(
        private chatService: ChatService,
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        if (!environment.features?.chatEnabled) {
            this.router.navigate(['/home']);
            return;
        }
        this.userService.getDataUser().subscribe((u) => {
            if (!canAccessChatNav('bot', u)) {
                this.router.navigate(['/chat']);
                return;
            }
            this.userId = u?.userId || '';
            this.reload();
        });
    }

    reload(): void {
        this.chatService.listBotCategories().subscribe((r) => (this.categories = r || []));
        this.chatService.listBotKeywords().subscribe((r) => (this.keywords = r || []));
        this.chatService.listBotResponses().subscribe((r) => (this.responses = r || []));
    }

    saveCategory(): void {
        if (!this.categoryForm.categoryName?.trim()) return;
        this.chatService.saveBotCategory(this.categoryForm).subscribe(() => {
            this.categoryForm = {};
            this.chatService.listBotCategories().subscribe((r) => (this.categories = r || []));
        });
    }

    deleteCategory(id: number): void {
        this.chatService.deleteBotCategory(id).subscribe(() => this.chatService.listBotCategories().subscribe((r) => (this.categories = r || [])));
    }

    saveKeyword(): void {
        if (!this.keywordForm.keywordName?.trim()) return;
        this.chatService.saveBotKeyword(this.keywordForm).subscribe((res) => {
            this.keywordForm = { isActive: 1, keywordGroupId: res?.keywordGroupId };
            this.chatService.listBotKeywords().subscribe((r) => (this.keywords = r || []));
        });
    }

    editKeyword(item: any): void {
        this.keywordForm = { ...item };
        this.responseForm = { ...this.responseForm, keywordGroupId: item.keywordGroupId };
    }

    deleteKeyword(id: number): void {
        this.chatService.deleteBotKeyword(id).subscribe(() => this.chatService.listBotKeywords().subscribe((r) => (this.keywords = r || [])));
    }

    saveResponse(): void {
        if (!this.responseForm.keywordGroupId) return;
        const type = String(this.responseForm.messageType || 'text').toLowerCase();
        if (type === 'text' && !this.responseForm.messageText?.trim()) return;

        const payload: any = {
            ...this.responseForm,
            createdById: this.userId,
            messageType: type,
        };
        if (type === 'image') {
            const url = String(this.responseForm.imageUrl || this.responseForm.messageText || '').trim();
            payload.messageData = url ? { originalContentUrl: url, previewImageUrl: url, url } : null;
            payload.messageText = payload.messageText || '[Image]';
        } else if (type === 'flex') {
            const raw = String(this.responseForm.flexJson || '').trim();
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    payload.messageData = parsed?.contents ? parsed : { altText: payload.messageText || 'Flex', contents: parsed };
                } catch {
                    return;
                }
            }
            payload.messageText = payload.messageText || 'Flex';
        } else {
            payload.messageData = null;
        }
        delete payload.imageUrl;
        delete payload.flexJson;

        this.chatService.saveBotResponse(payload).subscribe(() => {
            this.responseForm = {
                messageType: 'text',
                messageIndex: 0,
                keywordGroupId: this.responseForm.keywordGroupId,
            };
            this.chatService.listBotResponses().subscribe((r) => (this.responses = r || []));
        });
    }

    deleteResponse(id: number): void {
        this.chatService.deleteBotResponse(id).subscribe(() => this.chatService.listBotResponses().subscribe((r) => (this.responses = r || [])));
    }

    testMatch(): void {
        this.chatService.matchBot(this.testText).subscribe((r) => (this.testResult = r));
    }

    responsesForGroup(groupId: number): any[] {
        return (this.responses || []).filter((r) => r.keywordGroupId === groupId);
    }
}
