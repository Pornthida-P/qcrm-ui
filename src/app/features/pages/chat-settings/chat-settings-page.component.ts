import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

type ChatSettingsTab = 'schedules' | 'auto' | 'templates' | 'tags' | 'badwords';

@Component({
    selector: 'app-chat-settings-page',
    templateUrl: './chat-settings-page.component.html',
    styleUrl: './chat-settings-page.component.scss',
})
export class ChatSettingsPageComponent implements OnInit {
    tab: ChatSettingsTab = 'schedules';
    tabs: { id: ChatSettingsTab; label: string }[] = [
        { id: 'schedules', label: 'Schedules' },
        { id: 'auto', label: 'Auto messages' },
        { id: 'templates', label: 'Templates' },
        { id: 'tags', label: 'Tags' },
        { id: 'badwords', label: 'Bad words' },
    ];
    userId = '';

    schedules: any[] = [];
    autoMessages: any[] = [];
    endMessages: any[] = [];
    templates: any[] = [];
    tags: any[] = [];
    badwords: any[] = [];

    scheduleForm: any = { type: 'normal', day: 'Mon', canQueue: 1, canReplyWelcome: 1, canAbandon: 1, isActive: 1 };
    autoForm: any = { tagName: 'welcome', lang: 'TH', messageType: 'text', sortIndex: 0, isActive: 1 };
    endForm: any = { isActive: 1 };
    templateForm: any = { channelType: 'all', messageType: 'text', sortOrder: 0, isActive: 1 };
    tagForm: any = {};
    badwordForm: any = {};

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
        this.reloadAll();
    }

    setTab(tab: ChatSettingsTab): void {
        this.tab = tab;
    }

    reloadAll(): void {
        this.chatService.listSchedules().subscribe((r) => (this.schedules = r || []));
        this.chatService.listAutoMessages().subscribe((r) => (this.autoMessages = r || []));
        this.chatService.listEndMessages().subscribe((r) => (this.endMessages = r || []));
        this.chatService.listTemplates(undefined, true).subscribe((r) => (this.templates = r || []));
        this.chatService.listTagDictionary().subscribe((r) => (this.tags = r || []));
        this.chatService.listBadwords().subscribe((r) => (this.badwords = r || []));
    }

    saveSchedule(): void {
        this.chatService.saveSchedule({ ...this.scheduleForm, createdById: this.userId }).subscribe(() => {
            this.scheduleForm = { type: 'normal', day: 'Mon', canQueue: 1, canReplyWelcome: 1, canAbandon: 1, isActive: 1 };
            this.chatService.listSchedules().subscribe((r) => (this.schedules = r || []));
        });
    }

    editSchedule(item: any): void {
        this.scheduleForm = { ...item };
    }

    deleteSchedule(id: number): void {
        this.chatService.deleteSchedule(id).subscribe(() => this.chatService.listSchedules().subscribe((r) => (this.schedules = r || [])));
    }

    saveAuto(): void {
        this.chatService.saveAutoMessage({ ...this.autoForm, createdById: this.userId }).subscribe(() => {
            this.autoForm = { tagName: 'welcome', lang: 'TH', messageType: 'text', sortIndex: 0, isActive: 1 };
            this.chatService.listAutoMessages().subscribe((r) => (this.autoMessages = r || []));
        });
    }

    editAuto(item: any): void {
        this.autoForm = { ...item };
    }

    deleteAuto(id: number): void {
        this.chatService.deleteAutoMessage(id).subscribe(() => this.chatService.listAutoMessages().subscribe((r) => (this.autoMessages = r || [])));
    }

    saveEnd(): void {
        this.chatService.saveEndMessage({ ...this.endForm }).subscribe(() => {
            this.endForm = { isActive: 1 };
            this.chatService.listEndMessages().subscribe((r) => (this.endMessages = r || []));
        });
    }

    editEnd(item: any): void {
        this.endForm = { ...item };
    }

    saveTemplate(): void {
        this.chatService.saveTemplate({ ...this.templateForm, createdById: this.userId }).subscribe(() => {
            this.templateForm = { channelType: 'all', messageType: 'text', sortOrder: 0, isActive: 1 };
            this.chatService.listTemplates(undefined, true).subscribe((r) => (this.templates = r || []));
        });
    }

    editTemplate(item: any): void {
        this.templateForm = { ...item };
    }

    deleteTemplate(id: number): void {
        this.chatService.deleteTemplate(id).subscribe(() => this.chatService.listTemplates(undefined, true).subscribe((r) => (this.templates = r || [])));
    }

    saveTag(): void {
        if (!this.tagForm.tagName?.trim()) {
            return;
        }
        this.chatService.saveTagDictionary({ ...this.tagForm, createdById: this.userId }).subscribe(() => {
            this.tagForm = {};
            this.chatService.listTagDictionary().subscribe((r) => (this.tags = r || []));
        });
    }

    deleteTag(id: number): void {
        this.chatService.deleteTagDictionary(id).subscribe(() => this.chatService.listTagDictionary().subscribe((r) => (this.tags = r || [])));
    }

    saveBadword(): void {
        if (!this.badwordForm.word?.trim()) {
            return;
        }
        this.chatService.saveBadword({ ...this.badwordForm, createdById: this.userId }).subscribe(() => {
            this.badwordForm = {};
            this.chatService.listBadwords().subscribe((r) => (this.badwords = r || []));
        });
    }

    deleteBadword(id: number): void {
        this.chatService.deleteBadword(id).subscribe(() => this.chatService.listBadwords().subscribe((r) => (this.badwords = r || [])));
    }
}
