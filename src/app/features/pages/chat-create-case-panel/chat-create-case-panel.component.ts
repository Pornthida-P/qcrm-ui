import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
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
    caseTopicsList: any[] = [];
    caseTypes: any[] = [];
    allCaseSubjects: any[] = [];
    caseSubjects: any[] = [];
    statusList: any[] = [];

    filteredCaseTopics: any[] = [];
    filteredCaseTypes: any[] = [];
    filteredCaseSubjects: any[] = [];

    caseTopicControl = new FormControl('');
    caseTypeControl = new FormControl('');
    caseSubjectControl = new FormControl('');

    selectedChannels = '';
    selectedCaseTopic: any = null;
    selectedCaseType: any = null;
    selectedCaseSubject: any = null;
    selectedStatus: any = null;

    saving = false;

    displayCaseTopicFn = (caseTopic: any): string => caseTopic?.name || caseTopic?.code || '';
    displayCaseTypeFn = (caseType: any): string => caseType?.name || '';
    displayCaseSubjectFn = (caseSubject: any): string => caseSubject?.name || '';

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
            this.selectedCaseTopic = null;
            this.caseTopicControl.setValue('');
        }
    }

    filterCaseTopics(): void {
        const controlValue = this.caseTopicControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        if (!filterValue) {
            this.filteredCaseTopics = [...this.caseTopicsList];
            return;
        }
        this.filteredCaseTopics = this.caseTopicsList.filter(
            (topic: any) =>
                (topic.name || '').toLowerCase().includes(filterValue) || (topic.code || '').toLowerCase().includes(filterValue),
        );
    }

    filterCaseTypes(): void {
        const controlValue = this.caseTypeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        if (!filterValue) {
            this.filteredCaseTypes = [...this.caseTypes];
            return;
        }
        this.filteredCaseTypes = this.caseTypes.filter((type: any) => (type.name || '').toLowerCase().includes(filterValue));
    }

    filterCaseSubjects(): void {
        if (!this.selectedCaseTopic) {
            this.filteredCaseSubjects = [];
            return;
        }
        const controlValue = this.caseSubjectControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        if (!filterValue) {
            this.filteredCaseSubjects = [...this.caseSubjects];
            return;
        }
        this.filteredCaseSubjects = this.caseSubjects.filter((subject: any) =>
            (subject.name || '').toLowerCase().includes(filterValue),
        );
    }

    onCaseTopicSelected(event: any): void {
        this.selectedCaseTopic = event.option.value;
        this.selectedCaseSubject = null;
        this.caseSubjectControl.setValue('');
        this.refreshCaseSubjects();
    }

    onCaseTypeSelected(event: any): void {
        this.selectedCaseType = event.option.value;
    }

    onCaseSubjectSelected(event: any): void {
        this.selectedCaseSubject = event.option.value;
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
        if (!this.isSocialChannel && !this.selectedCaseTopic) {
            this.sweetalert.error('alert.pleaseEnterCode');
            return;
        }

        this.saving = true;
        const ensureContact$ = this.contactId ? this.ensureContactChatLink() : this.createContact();

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
        this.resetCaseSelections();
        this.matchChannel(conv);
        this.lookupExistingContact(conv.chatRoomId);
        if (this.contactId) {
            this.loadCaseHistory(this.contactId);
        }
    }

    private resetCaseSelections(): void {
        this.selectedCaseTopic = null;
        this.selectedCaseType = null;
        this.selectedCaseSubject = null;
        this.caseTopicControl.setValue('');
        this.caseTypeControl.setValue('');
        this.caseSubjectControl.setValue('');
        this.caseSubjects = [];
        this.filteredCaseTopics = [...this.caseTopicsList];
        this.filteredCaseTypes = [...this.caseTypes];
        this.filteredCaseSubjects = [];
    }

    private refreshCaseSubjects(): void {
        const topicId = this.selectedCaseTopic?.caseTopicId ?? this.selectedCaseTopic?.id ?? this.selectedCaseTopic;
        if (!topicId) {
            this.caseSubjects = [];
            this.filteredCaseSubjects = [];
            return;
        }

        this.callService.getCaseSubjects(topicId).subscribe((list: any) => {
            this.caseSubjects = Array.isArray(list) ? list : [];
            this.filteredCaseSubjects = [...this.caseSubjects];
        });
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
        this.callService.getCaseTopics().subscribe((list: any) => {
            this.caseTopicsList = list || [];
            this.filteredCaseTopics = [...this.caseTopicsList];
        });
        this.callService.getCaseType().subscribe((list: any) => {
            this.caseTypes = list || [];
            this.filteredCaseTypes = [...this.caseTypes];
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

        const chatRoomId = String(conv.chatRoomId || '');
        const typeHint = String(conv.channelType || conv.channelKey || '').toLowerCase().trim();
        const kind =
            chatRoomId.startsWith('line_') || typeHint === 'line'
                ? 'line'
                : chatRoomId.startsWith('fb_') || typeHint === 'facebook' || typeHint === 'fb'
                  ? 'facebook'
                  : '';

        if (kind === 'line') {
            const matched = this.channels.find((ch) => {
                const n = String(ch.name || '')
                    .toLowerCase()
                    .trim();
                return n === 'line' || n.startsWith('line ') || (n.includes('line') && !n.includes('online'));
            });
            if (matched) {
                this.selectedChannels = matched.channelId;
                return;
            }
        }

        if (kind === 'facebook') {
            const matched = this.channels.find((ch) => {
                const n = String(ch.name || '')
                    .toLowerCase()
                    .trim();
                return n.includes('facebook') || n.includes('messenger') || n === 'fb';
            });
            if (matched) {
                this.selectedChannels = matched.channelId;
                return;
            }
        }

        const hint = (conv.channelName || typeHint || '').toLowerCase();
        const matched = this.channels.find((ch) => {
            const name = (ch.name || '').toLowerCase();
            if (!hint || !name) {
                return false;
            }
            // Exact / prefix only — avoid "online".includes("line")
            return name === hint || name.startsWith(hint + ' ') || hint.startsWith(name + ' ');
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
        const chatType = this.selectedChannels || this.conversation?.channelType || this.conversation?.channelKey || '';
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
                return this.createContact();
            }),
            catchError(() => this.createContact()),
        );
    }

    private createCase() {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const requestDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const dataForm = {
            caseId: null,
            contactId: this.contactId,
            channelId: this.selectedChannels,
            requestDateTime,
            description: this.description,
            caseTypeId: this.selectedCaseType?.id ?? this.selectedCaseType,
            caseTopicId: this.selectedCaseTopic?.caseTopicId ?? this.selectedCaseTopic?.id ?? this.selectedCaseTopic,
            caseSubjectId: this.selectedCaseSubject?.caseSubjectId ?? this.selectedCaseSubject?.id ?? this.selectedCaseSubject,
            operationType: config.operationType.inbound,
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
        };
        return this.callService.createCase(dataForm);
    }
}
