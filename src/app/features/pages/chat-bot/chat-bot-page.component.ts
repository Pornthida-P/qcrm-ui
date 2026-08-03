import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

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
        this.userService.getDataUser().subscribe((u) => (this.userId = u?.userId || ''));
        this.reload();
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
        if (!this.responseForm.keywordGroupId || !this.responseForm.messageText?.trim()) return;
        this.chatService.saveBotResponse({ ...this.responseForm, createdById: this.userId }).subscribe(() => {
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
