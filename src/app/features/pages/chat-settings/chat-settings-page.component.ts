import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallService } from 'src/app/services/call/call.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { canAccessChatNav } from '../chat-page/chat-access';

type ChatSettingsTab = 'channels' | 'schedules' | 'auto' | 'templates' | 'tags' | 'badwords';

@Component({
    selector: 'app-chat-settings-page',
    templateUrl: './chat-settings-page.component.html',
    styleUrl: './chat-settings-page.component.scss',
})
export class ChatSettingsPageComponent implements OnInit {
    tab: ChatSettingsTab = 'channels';
    tabs: { id: ChatSettingsTab; label: string }[] = [
        { id: 'channels', label: 'menu.chat.settings.channels' },
        { id: 'schedules', label: 'menu.chat.settings.schedules' },
        { id: 'auto', label: 'menu.chat.settings.auto-messages' },
        { id: 'templates', label: 'menu.chat.settings.templates' },
        { id: 'tags', label: 'menu.chat.settings.tags' },
        { id: 'badwords', label: 'menu.chat.settings.bad-words' },
    ];
    userId = '';

    /** Master list from `channels` table (type options) */
    channelTypeOptions: any[] = [];
    /** Managed connectors from `chatChannels` */
    channels: any[] = [];
    schedules: any[] = [];
    autoMessages: any[] = [];
    endMessages: any[] = [];
    templates: any[] = [];
    tags: any[] = [];
    badwords: any[] = [];

    channelForm: any = { channelType: '', isActive: 1, credentials: {} };
    scheduleForm: any = { type: 'normal', day: 'Mon', canQueue: 1, canReplyWelcome: 1, canAbandon: 1, isActive: 1 };
    autoForm: any = { tagName: 'welcome', lang: 'TH', messageType: 'text', sortIndex: 0, isActive: 1 };
    endForm: any = { isActive: 1 };
    templateForm: any = { channelType: 'all', messageType: 'text', sortOrder: 0, isActive: 1 };
    tagForm: any = {};
    badwordForm: any = {};
    readonly apiBaseUrl = environment.api.url;

    constructor(
        private chatService: ChatService,
        private callService: CallService,
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        if (!environment.features?.chatEnabled) {
            this.router.navigate(['/home']);
            return;
        }
        this.userService.getDataUser().subscribe((u) => {
            if (!canAccessChatNav('settings', u)) {
                this.router.navigate(['/chat']);
                return;
            }
            this.userId = u?.userId || '';
            this.reloadAll();
        });
    }

    setTab(tab: ChatSettingsTab): void {
        this.tab = tab;
    }

    reloadAll(): void {
        this.callService.getAllChannels().subscribe((rows: any) => {
            const list = this.parseList(rows).filter((c) => c?.name);
            this.channelTypeOptions = list;
            if (!this.channelForm.channelType && list.length) {
                this.channelForm.channelType = this.channelTypeValue(list[0]);
            }
        });
        this.chatService.listChannelsAdmin().subscribe((r) => (this.channels = r || []));
        this.chatService.listSchedules().subscribe((r) => (this.schedules = r || []));
        this.chatService.listAutoMessages().subscribe((r) => (this.autoMessages = r || []));
        this.chatService.listEndMessages().subscribe((r) => (this.endMessages = r || []));
        this.chatService.listTemplates(undefined, true).subscribe((r) => (this.templates = r || []));
        this.chatService.listTagDictionary().subscribe((r) => (this.tags = r || []));
        this.chatService.listBadwords().subscribe((r) => (this.badwords = r || []));
    }

    channelTypeValue(channel: any): string {
        return String(channel?.name || '')
            .trim()
            .toLowerCase();
    }

    channelTypeLabel(type: string): string {
        if (!type) {
            return '-';
        }
        const found = this.channelTypeOptions.find((c) => this.channelTypeValue(c) === String(type).toLowerCase());
        return found?.name || type;
    }

    isLineChannel(type?: string): boolean {
        return String(type || this.channelForm.channelType || '')
            .toLowerCase()
            .includes('line');
    }

    isFacebookChannel(type?: string): boolean {
        const t = String(type || this.channelForm.channelType || '').toLowerCase();
        return t.includes('facebook') || t === 'fb';
    }

    webhookUrl(channelKey: string, type: string): string {
        const key = encodeURIComponent(channelKey || '');
        if (this.isLineChannel(type)) {
            return `${this.apiBaseUrl}/chat/webhook/line/${key}`;
        }
        if (this.isFacebookChannel(type)) {
            return `${this.apiBaseUrl}/chat/webhook/facebook/${key}`;
        }
        return '';
    }

    resetChannelForm(): void {
        this.channelForm = {
            channelType: this.channelTypeOptions.length ? this.channelTypeValue(this.channelTypeOptions[0]) : '',
            isActive: 1,
            credentials: {},
        };
    }

    isChannelActive(channel: any): boolean {
        return Number(channel?.isActive) === 1;
    }

    saveChannel(): void {
        if (!this.channelForm.channelKey?.trim() || !this.channelForm.channelType?.trim()) {
            return;
        }
        const channelKey = this.channelForm.channelKey.trim();
        const credentials = { ...(this.channelForm.credentials || {}) };
        Object.keys(credentials).forEach((k) => {
            if (credentials[k] === '' || credentials[k] == null) {
                delete credentials[k];
            }
        });
        const payload = {
            ...this.channelForm,
            channelKey,
            channelName: this.channelForm.channelName || channelKey,
            displayName: this.channelForm.displayName || this.channelForm.channelName || channelKey,
            credentials: Object.keys(credentials).length ? credentials : this.channelForm.id ? undefined : null,
        };
        this.chatService.saveChannel(payload).subscribe(() => {
            this.resetChannelForm();
            this.chatService.listChannelsAdmin().subscribe((r) => (this.channels = r || []));
        });
    }

    editChannel(item: any): void {
        this.channelForm = {
            ...item,
            channelType: String(item?.channelType || '').toLowerCase(),
            credentials: { ...(item?.credentials || {}) },
        };
    }

    deleteChannel(id: number): void {
        this.chatService.deleteChannel(id).subscribe(() => this.chatService.listChannelsAdmin().subscribe((r) => (this.channels = r || [])));
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

    private parseList(rows: any): any[] {
        if (typeof rows === 'string') {
            try {
                rows = JSON.parse(rows);
            } catch {
                return [];
            }
        }
        return Array.isArray(rows) ? rows : [];
    }
}
