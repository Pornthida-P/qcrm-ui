import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { switchMap, of, catchError } from 'rxjs';
import { config } from 'src/app/config/config';
import { CallService } from 'src/app/services/call/call.service';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { StatusService } from 'src/app/services/status/status.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ChatConversation } from 'src/app/shared/interface/chat.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-chat-create-case-panel',
    templateUrl: './chat-create-case-panel.component.html',
    styleUrl: './chat-create-case-panel.component.scss',
})
export class ChatCreateCasePanelComponent implements OnInit, OnChanges {
    @Input() conversation: ChatConversation | null = null;
    @Input() user: User | null = null;
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<{ contactId: string; caseId?: string }>();

    private readonly socialChannelIds = ['4', '5'];

    firstName = '';
    lastName = '';
    phone = '';
    description = '';
    solutions = '';

    contactId = '';
    contactChatId = '';
    contactLabel = '';
    lookingUpContact = false;

    caseHistory: any[] = [];
    loadingHistory = false;

    channels: any[] = [];
    caseCodes: any[] = [];
    caseTypes: any[] = [];
    serviceGroups: any[] = [];
    allServiceTypes: any[] = [];
    serviceTypes: any[] = [];
    allServiceSubTypes: any[] = [];
    serviceSubTypes: any[] = [];
    statusList: any[] = [];

    selectedChannels = '';
    selectedCaseCode: any = null;
    selectedCaseType: any = null;
    selectedServiceGroup: any = null;
    selectedServiceType: any = null;
    selectedServiceSubType: any = null;
    selectedStatus: any = null;

    saving = false;

    get isSocialChannel(): boolean {
        return this.socialChannelIds.includes(String(this.selectedChannels));
    }

    get channelLabel(): string {
        const conv = this.conversation;
        if (!conv) {
            return '';
        }
        return conv.channelName || conv.channelType || conv.channelKey || '';
    }

    constructor(
        private callService: CallService,
        private callListService: CallListService,
        private contactsService: ContactsService,
        private sweetalert: SweetAlertService,
        public statusService: StatusService,
    ) {}

    ngOnInit(): void {
        this.loadLookups();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['conversation'] && this.conversation) {
            this.applyConversation(this.conversation);
        }
    }

    close(): void {
        this.closed.emit();
    }

    onChannelChange(): void {
        if (this.isSocialChannel) {
            this.selectedCaseCode = null;
        }
    }

    onServiceGroupChange(): void {
        this.selectedServiceType = null;
        this.selectedServiceSubType = null;
        this.serviceSubTypes = [];
        const groupId = this.selectedServiceGroup?.id ?? this.selectedServiceGroup;
        this.serviceTypes = (this.allServiceTypes || []).filter((t) => {
            const ids = t.caseServiceGroupIds || t.groupIds || [];
            if (Array.isArray(ids) && ids.length) {
                return ids.map(String).includes(String(groupId));
            }
            return !groupId || String(t.caseServiceGroupId) === String(groupId) || !t.caseServiceGroupId;
        });
    }

    onServiceTypeChange(): void {
        this.selectedServiceSubType = null;
        const typeId = this.selectedServiceType?.id ?? this.selectedServiceType;
        this.serviceSubTypes = (this.allServiceSubTypes || []).filter((s) => {
            const ids = s.caseServiceTypeIds || s.typeIds || [];
            if (Array.isArray(ids) && ids.length) {
                return ids.map(String).includes(String(typeId));
            }
            return !typeId || String(s.caseServiceTypeId) === String(typeId) || !s.caseServiceTypeId;
        });
    }

    save(): void {
        if (!this.conversation || this.saving) {
            return;
        }
        if (!this.firstName.trim()) {
            this.sweetalert.error('alert.pleaseEnterData');
            return;
        }
        if (!this.selectedChannels) {
            this.sweetalert.error('alert.pleaseEnterData');
            return;
        }
        if (!this.isSocialChannel && !this.selectedCaseCode) {
            this.sweetalert.error('alert.pleaseEnterCode');
            return;
        }

        this.saving = true;
        const ensureContact$ = this.contactId
            ? this.ensureContactChatLink()
            : this.createContact();

        ensureContact$
            .pipe(
                switchMap((link) => {
                    this.contactId = link.contactId;
                    this.contactChatId = link.contactChatId;
                    return this.createCase();
                }),
                catchError((err) => {
                    this.saving = false;
                    this.sweetalert.handleError(err);
                    return of(null);
                }),
            )
            .subscribe((res: any) => {
                this.saving = false;
                if (!res) {
                    return;
                }
                this.sweetalert.success('alert.saveSuccess');
                this.saved.emit({ contactId: this.contactId, caseId: res?.caseId || res?.id });
                this.closed.emit();
            });
    }

    private applyConversation(conv: ChatConversation): void {
        const parts = (conv.displayName || '').trim().split(/\s+/);
        this.firstName = parts[0] || conv.displayName || 'Chat';
        this.lastName = parts.slice(1).join(' ') || '';
        this.phone = conv.phoneNumber || '';
        this.description = '';
        this.solutions = '';
        this.contactId = conv.contactId || '';
        this.contactChatId = '';
        this.contactLabel = '';
        this.caseHistory = [];
        this.selectedCaseCode = null;
        this.selectedCaseType = null;
        this.selectedServiceGroup = null;
        this.selectedServiceType = null;
        this.selectedServiceSubType = null;
        this.matchChannel(conv);
        this.lookupExistingContact(conv.chatRoomId);
        if (this.contactId) {
            this.loadCaseHistory(this.contactId);
        }
    }

    private loadCaseHistory(contactId: string): void {
        if (!contactId) {
            this.caseHistory = [];
            return;
        }
        this.loadingHistory = true;
        this.callService.getCasesByContactId(contactId, 5).subscribe({
            next: (res: any) => {
                const rows = typeof res === 'string' ? JSON.parse(res) : res;
                this.caseHistory = Array.isArray(rows) ? rows : [];
                this.loadingHistory = false;
            },
            error: () => {
                this.caseHistory = [];
                this.loadingHistory = false;
            },
        });
    }

    private loadLookups(): void {
        this.callService.getCaseCode().subscribe((list: any) => (this.caseCodes = list || []));
        this.callService.getCaseType().subscribe((list: any) => (this.caseTypes = list || []));
        this.callService.getCaseServiceGroup().subscribe((list: any) => (this.serviceGroups = list || []));
        this.callService.getCaseServiceType().subscribe((list: any) => {
            this.allServiceTypes = Array.isArray(list) ? list : [];
            this.serviceTypes = [...this.allServiceTypes];
        });
        this.callService.getServiceSubType().subscribe((list: any) => {
            this.allServiceSubTypes = Array.isArray(list) ? list : [];
        });
        this.callService.getAllChannels().subscribe((channels: any) => {
            this.channels = channels || [];
            if (this.conversation) {
                this.matchChannel(this.conversation);
            }
        });
        this.callListService.getStatusList().subscribe((list: any) => {
            this.statusList = list || [];
            if (!this.selectedStatus && this.statusList.length) {
                this.selectedStatus = this.statusList[0].id ?? this.statusList[0].statusId ?? this.statusList[0];
            }
        });
    }

    private matchChannel(conv: ChatConversation): void {
        if (!this.channels?.length) {
            return;
        }
        const hint = (conv.channelType || conv.channelKey || conv.channelName || '').toLowerCase();
        const matched = this.channels.find((ch) => {
            const name = (ch.name || '').toLowerCase();
            return hint && (name.includes(hint) || hint.includes(name));
        });
        if (matched) {
            this.selectedChannels = matched.channelId;
            return;
        }
        const social = this.channels.find((ch) => this.socialChannelIds.includes(String(ch.channelId)));
        this.selectedChannels = social?.channelId || this.channels[0]?.channelId || '';
    }

    private lookupExistingContact(chatRoomId: string): void {
        if (!chatRoomId) {
            return;
        }
        this.lookingUpContact = true;
        this.contactsService.getContactChatId(chatRoomId).subscribe({
            next: (res: any) => {
                const rows = typeof res === 'string' ? JSON.parse(res) : res;
                if (Array.isArray(rows) && rows.length) {
                    this.contactChatId = rows[0].contactChatId || '';
                    this.contactLabel = rows[0].displayName || '';
                    if (rows[0].contactId) {
                        this.contactId = rows[0].contactId;
                    }
                }
                if (!this.contactId) {
                    this.contactsService.getContactsByParamPhone(chatRoomId).subscribe({
                        next: (data: any) => {
                            if (Array.isArray(data) && data.length) {
                                this.contactId = data[0].contactId;
                                this.firstName = data[0].firstName || this.firstName;
                                this.lastName = data[0].lastName || this.lastName;
                                this.phone = data[0].contactNumber || this.phone;
                                this.contactLabel = `${this.firstName} ${this.lastName}`.trim();
                                this.loadCaseHistory(this.contactId);
                            }
                            this.lookingUpContact = false;
                        },
                        error: () => {
                            this.lookingUpContact = false;
                        },
                    });
                    return;
                }
                this.loadCaseHistory(this.contactId);
                this.lookingUpContact = false;
            },
            error: () => {
                this.lookingUpContact = false;
            },
        });
    }

    private createContact() {
        const chatType = this.conversation?.channelType || this.conversation?.channelKey || '';
        const payload = {
            firstName: this.firstName.trim(),
            lastName: this.lastName.trim(),
            organizationId: null,
            contactType: this.conversation?.contactType || null,
            contactNumber: this.phone || null,
            province: null,
            gender: 'unknown',
            createdById: this.user?.userId,
            contactNumber2: null,
            chatId: this.conversation?.chatRoomId,
            uuidLine: this.conversation?.externalUserId || null,
            chatType,
            displayName: this.conversation?.displayName || this.firstName,
            issue: this.conversation?.issue || null,
            email: null,
        };

        return this.contactsService.createContacts(payload).pipe(
            switchMap((res: any) => {
                if (res?.success === false && res?.message === 'Duplicate' && res?.contactChatId) {
                    return of({
                        contactId: res.contactId || res.duplicates?.[0]?.contactId || this.contactId,
                        contactChatId: res.contactChatId,
                    });
                }
                if (res?.success === false) {
                    throw res;
                }
                return of({
                    contactId: res.contactId,
                    contactChatId: res.contactChatId,
                });
            }),
        );
    }

    private ensureContactChatLink() {
        if (this.contactChatId) {
            return of({ contactId: this.contactId, contactChatId: this.contactChatId });
        }
        const chatRoomId = this.conversation?.chatRoomId || '';
        return this.contactsService.getContactChatId(chatRoomId).pipe(
            switchMap((res: any) => {
                const rows = typeof res === 'string' ? JSON.parse(res) : res;
                if (Array.isArray(rows) && rows[0]?.contactChatId) {
                    return of({ contactId: this.contactId, contactChatId: rows[0].contactChatId });
                }
                // No link yet — create contact payload will attach chatId (may hit duplicate path for phone)
                return this.createContact();
            }),
            catchError(() => this.createContact()),
        );
    }

    private createCase() {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const requestDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const caseCodeId = this.isSocialChannel
            ? null
            : this.selectedCaseCode?.id ?? this.selectedCaseCode;
        const dataForm = {
            caseId: null,
            contactId: this.contactId,
            channelId: this.selectedChannels,
            requestDateTime,
            description: this.description,
            caseCodeId,
            caseTypeId: this.selectedCaseType?.id ?? this.selectedCaseType,
            caseServiceGroupId: this.selectedServiceGroup?.id ?? this.selectedServiceGroup,
            caseServiceTypeId: this.selectedServiceType?.id ?? this.selectedServiceType,
            caseServiceSubTypeId: this.selectedServiceSubType?.id ?? this.selectedServiceSubType,
            caseGroupReportId: null,
            operationType: config.operationType.inbound,
            priority: null,
            status: this.selectedStatus?.id ?? this.selectedStatus,
            callStatus: null,
            sentimentId: null,
            solution: this.solutions,
            contactNumber: null,
            source: null,
            assignedAt: null,
            createdAt: now.toISOString(),
            createdById: this.user?.userId,
            modifiedAt: now.toISOString(),
            modifiedById: null,
            isDeleted: 0,
            assignedUserId: this.user?.userId || null,
            attachment: [],
            comment: '',
            chatId: this.contactChatId,
            uuidLine: this.conversation?.externalUserId || null,
            chatType: this.conversation?.channelType || this.conversation?.channelKey || '',
            firstName: this.conversation?.displayName || this.firstName,
            casePriority: null,
        };
        return this.callService.createCase(dataForm);
    }
}
