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
    caseCodes: any[] = [];
    caseTypes: any[] = [];
    serviceGroups: any[] = [];
    allServiceTypes: any[] = [];
    serviceTypes: any[] = [];
    allServiceSubTypes: any[] = [];
    serviceSubTypes: any[] = [];
    statusList: any[] = [];

    filteredCodes: any[] = [];
    filteredCaseTypes: any[] = [];
    filteredServiceGroups: any[] = [];
    filteredServiceTypes: any[] = [];
    filteredServiceSubTypes: any[] = [];

    codeControl = new FormControl('');
    caseTypeControl = new FormControl('');
    serviceGroupControl = new FormControl('');
    serviceTypeControl = new FormControl('');
    serviceSubTypeControl = new FormControl('');

    selectedChannels = '';
    selectedCaseCode: any = null;
    selectedCaseType: any = null;
    selectedServiceGroup: any = null;
    selectedServiceType: any = null;
    selectedServiceSubType: any = null;
    selectedStatus: any = null;

    saving = false;

    displayCodeFn = (code: any): string => code?.code || '';
    displayCaseTypeFn = (caseType: any): string => caseType?.name || '';
    displayServiceGroupFn = (serviceGroup: any): string => serviceGroup?.name || '';
    displayServiceTypeFn = (serviceType: any): string => serviceType?.name || '';
    displayServiceSubTypeFn = (serviceSubType: any): string => serviceSubType?.name || '';

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
            this.codeControl.setValue('');
        }
    }

    filterCodes(): void {
        const controlValue = this.codeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.code : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        if (!filterValue) {
            this.filteredCodes = [...this.caseCodes];
            return;
        }
        this.filteredCodes = this.caseCodes.filter((code: any) => (code.code || '').toLowerCase().includes(filterValue));
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

    filterServiceGroups(): void {
        const controlValue = this.serviceGroupControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        if (!filterValue) {
            this.filteredServiceGroups = [...this.serviceGroups];
            return;
        }
        this.filteredServiceGroups = this.serviceGroups.filter((group: any) =>
            (group.name || '').toLowerCase().includes(filterValue),
        );
    }

    filterServiceTypes(): void {
        if (!this.selectedServiceGroup) {
            this.filteredServiceTypes = [];
            return;
        }
        const controlValue = this.serviceTypeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        if (!filterValue) {
            this.filteredServiceTypes = [...this.serviceTypes];
            return;
        }
        this.filteredServiceTypes = this.serviceTypes.filter((type: any) => (type.name || '').toLowerCase().includes(filterValue));
    }

    filterServiceSubTypes(): void {
        if (!this.selectedServiceType) {
            this.filteredServiceSubTypes = [];
            return;
        }
        const controlValue = this.serviceSubTypeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        if (!filterValue) {
            this.filteredServiceSubTypes = [...this.serviceSubTypes];
            return;
        }
        this.filteredServiceSubTypes = this.serviceSubTypes.filter((sub: any) =>
            (sub.name || '').toLowerCase().includes(filterValue),
        );
    }

    onCodeSelected(event: any): void {
        const selected = event.option.value;
        this.selectedCaseCode = selected;
    }

    onCaseTypeSelected(event: any): void {
        this.selectedCaseType = event.option.value;
    }

    onServiceGroupSelected(event: any): void {
        this.selectedServiceGroup = event.option.value;
        this.selectedServiceType = null;
        this.selectedServiceSubType = null;
        this.serviceTypeControl.setValue('');
        this.serviceSubTypeControl.setValue('');
        this.serviceSubTypes = [];
        this.filteredServiceSubTypes = [];
        this.refreshServiceTypes();
    }

    onServiceTypeSelected(event: any): void {
        this.selectedServiceType = event.option.value;
        this.selectedServiceSubType = null;
        this.serviceSubTypeControl.setValue('');
        this.refreshServiceSubTypes();
    }

    onServiceSubTypeSelected(event: any): void {
        this.selectedServiceSubType = event.option.value;
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
        this.selectedCaseCode = null;
        this.selectedCaseType = null;
        this.selectedServiceGroup = null;
        this.selectedServiceType = null;
        this.selectedServiceSubType = null;
        this.codeControl.setValue('');
        this.caseTypeControl.setValue('');
        this.serviceGroupControl.setValue('');
        this.serviceTypeControl.setValue('');
        this.serviceSubTypeControl.setValue('');
        this.serviceTypes = [...(this.allServiceTypes || [])];
        this.serviceSubTypes = [];
        this.filteredCodes = [...this.caseCodes];
        this.filteredCaseTypes = [...this.caseTypes];
        this.filteredServiceGroups = [...this.serviceGroups];
        this.filteredServiceTypes = [...this.serviceTypes];
        this.filteredServiceSubTypes = [];
    }

    private refreshServiceTypes(): void {
        const groupId = this.selectedServiceGroup?.id ?? this.selectedServiceGroup;
        this.serviceTypes = (this.allServiceTypes || []).filter((t) => {
            const ids = t.caseServiceGroupIds || t.groupIds || [];
            if (Array.isArray(ids) && ids.length) {
                return ids.map(String).includes(String(groupId));
            }
            return !groupId || String(t.caseServiceGroupId) === String(groupId) || !t.caseServiceGroupId;
        });
        this.filteredServiceTypes = [...this.serviceTypes];
    }

    private refreshServiceSubTypes(): void {
        const typeId = this.selectedServiceType?.id ?? this.selectedServiceType;
        this.serviceSubTypes = (this.allServiceSubTypes || []).filter((s) => {
            const ids = s.caseServiceTypeIds || s.typeIds || [];
            if (Array.isArray(ids) && ids.length) {
                return ids.map(String).includes(String(typeId));
            }
            return !typeId || String(s.caseServiceTypeId) === String(typeId) || !s.caseServiceTypeId;
        });
        this.filteredServiceSubTypes = [...this.serviceSubTypes];
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
        this.callService.getCaseCode().subscribe((list: any) => {
            this.caseCodes = list || [];
            this.filteredCodes = [...this.caseCodes];
        });
        this.callService.getCaseType().subscribe((list: any) => {
            this.caseTypes = list || [];
            this.filteredCaseTypes = [...this.caseTypes];
        });
        this.callService.getCaseServiceGroup().subscribe((list: any) => {
            this.serviceGroups = list || [];
            this.filteredServiceGroups = [...this.serviceGroups];
        });
        this.callService.getCaseServiceType().subscribe((list: any) => {
            this.allServiceTypes = Array.isArray(list) ? list : [];
            this.serviceTypes = [...this.allServiceTypes];
            this.filteredServiceTypes = [...this.serviceTypes];
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
                return this.createContact();
            }),
            catchError(() => this.createContact()),
        );
    }

    private createCase() {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const requestDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const caseCodeId = this.isSocialChannel ? null : this.selectedCaseCode?.id ?? this.selectedCaseCode;
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
