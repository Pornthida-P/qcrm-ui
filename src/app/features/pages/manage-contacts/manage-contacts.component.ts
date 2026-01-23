import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { catchError, finalize, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { CallService } from 'src/app/services/call/call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { Attachment } from 'src/app/shared/interface/attachment.interface';
import Swal from 'sweetalert2';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import * as moment from 'moment';
import { WebSocketSubject } from 'rxjs/webSocket';
import { TranslateService } from '@ngx-translate/core';
declare var bootstrap: any;
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { environment } from 'src/environments/environment';
import { StatusService } from 'src/app/services/status/status.service';

@Component({
    selector: 'app-manage-contacts',
    templateUrl: './manage-contacts.component.html',
    styleUrls: ['./manage-contacts.component.scss'],
})
export class ManageContactsComponent implements OnInit {
    MultiNumber: boolean = false;
    contactCall: any[] = [];
    contact: any = {};
    contactFirstName: string = '';
    contactLastName: string = '';
    contactOrg: string = '';
    contactOrgName: string = '';
    contactType: string = '';
    contactNum: string = '';
    contactNum2: string = '';
    contactProvince: string = '';
    contactGender: string = 'unknown';
    contactCreatedByID: string = '';
    contactCreatedAt: string = '';
    contactModifiedByID: string = '';
    contactModifiedAt: string = '';
    contactId: string = '';
    contactEmail: string = '';
    state: string = '';
    detailItem: any = undefined;
    TableShowing: boolean = false;
    AddCallShowing: boolean = false;
    SearchButton: boolean = true;

    cType: string = '';
    callId: string = '';
    caseCodes: any[] = [];
    caseTypes: any[] = [];
    serviceGroups: any[] = [];
    serviceTypes: any[] = [];
    serviceSubTypes: any[] = [];
    selectedCaseCode: any = null;
    selectedCaseCodeObject: any = null;
    selectedCaseType: any = null;
    selectedServiceGroup: any = null;
    selectedServiceType: any = null;
    selectedServiceSubType: any = null;
    selectedChannels: any;
    currentChannel: any;
    channels: any;
    solutions: string = '';
    description: string = '';
    timepickStart: { hour: number; minute: number; second: number } = { hour: 0, minute: 0, second: 0 };
    newDateTime: any;
    startTime: string = '';

    seconds = true;

    attachments: Attachment[] = [];
    attachmentsId: string[] | undefined;

    selectedFilter: any | undefined;

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userRole: string = '';

    calls: string | null | undefined;
    userId: string = '';

    selectedCallTypeId: string = '';
    inbound: string = config.operationType.inbound;
    outbound: string = config.operationType.outbound;
    callTypes: any;
    caller_id: string = '';

    private socket$!: WebSocketSubject<any>;
    results: string[] = [];
    connected: boolean = false;

    attachmentShowing: boolean = false;

    isStatusDisabled: boolean = false;
    isChannelDisabled: boolean = false;
    isCallTypeDisabled: boolean = false;
    isContactNumberDisabled: boolean = false;
    isDateDisabled: boolean = false;
    isDescriptionDisabled: boolean = false;

    isCommentsHistoryShowing: boolean = false;

    contactNumParams: any;

    contactNumber: any;
    contactNumbers: { contactNumber: string }[] = [];
    selectedContactNumber: { contactNumber: string; contactNumberId: string } | null = null;

    contactNumNew: string = '';

    isInputVisible: boolean = false;

    statusList: any[] = [];
    selectedStatus: any;
    originalStatus: any;
    chatId: any;
    chatType: any;
    originalChatId: any;
    originalChatType: any;
    displayName: any;
    issue: any;
    caseId: any;
    comment: any;
    comments: any[] = [];
    uuidLine: any;

    chatHistory: any[] = [];
    activeScriptTab: 'script' | 'chat' = 'script';
    callStatus: any;
    selectedCallStatusId: number | null = null;
    originalCallStatusId: number | null = null;
    callStatusId: any;
    history: any;

    // Sentiment
    sentiments: any[] = [];
    selectedSentiment: number | null = null;

    // Autocomplete controls
    codeControl = new FormControl('');
    caseTypeControl = new FormControl('');
    serviceTypeControl = new FormControl('');
    serviceGroupControl = new FormControl('');
    serviceSubTypeControl = new FormControl('');
    filteredCodes: any[] = [];
    filteredCaseTypes: any[] = [];
    filteredServiceTypes: any[] = [];
    filteredServiceGroups: any[] = [];
    filteredServiceSubTypes: any[] = [];
    partnerCode: any;
    contactGroupId: any;
    contactGroup: any;
    contactChatId: any;
    contactChatDisplayName: string = '';

    constructor(
        private contactsService: ContactsService,
        private sweetalertServices: SweetAlertService,
        private route: ActivatedRoute,
        private router: Router,
        private auditLogService: AuditLogService,
        private attachmentService: AttachmentService,
        private callServive: CallService,
        private translate: TranslateService,
        private callListService: CallListService,
        public statusService: StatusService,
    ) {
        this.contact = { components: [] };
        this.startTime = this.formatDate(new Date());
    }

    ngOnInit(): void {
        const state = history.state;
        if (state.itemId) {
            this.contactId = state.itemId;
            this.state = state.state;
        } else {
            this.route.queryParams.subscribe((params) => {
                this.contactId = params['key'];
                this.calls = params['phone'];
                this.caller_id = params['caller_id'];
                this.contactNum = params['call_id'];
                this.contactNumParams = params['call_id'];
                this.chatId = params['chatid']?.trim();
                this.chatType = params['chattype']?.trim();
                this.originalChatId = params['chatid']?.trim();
                this.originalChatType = params['chattype']?.trim();
                this.displayName = params['displayName'];
                this.issue = params['issue'];
                this.caseId = params['caseId'];
                this.uuidLine = params['userId'];

                // Set contactChatDisplayName from URL param for new contacts
                if (this.displayName && !this.contactId) {
                    this.contactChatDisplayName = this.displayName;
                }

                // Check if contact with chatId already exists (redirect if found)
                if (this.chatId && !this.contactId) {
                    const trimmedChatId = this.chatId.trim();
                    this.contactsService.getContactsByParamPhone(trimmedChatId).subscribe({
                        next: (result: any) => {
                            // API returns array, get first contact if exists
                            const existingContact = Array.isArray(result) ? result[0] : result;
                            if (existingContact && existingContact.contactId) {
                                // Contact exists → redirect to edit page with all params
                                const redirectParams = new URLSearchParams({
                                    key: existingContact.contactId,
                                    chatid: this.chatId || '',
                                    chattype: this.chatType || '',
                                    displayName: this.displayName || '',
                                    issue: this.issue || '',
                                    uuidLine: this.uuidLine || ''
                                });
                                window.location.href = `${environment.subPath}/contacts/edit?${redirectParams.toString()}`;
                            }
                        },
                        error: () => {
                            // No existing contact found → allow create new
                            console.log('No existing contact found for chatId, allow create new');
                        }
                    });
                }

                // React to the new contactId
                if (this.contactId) {
                    this.getContactById(this.contactId);
                }

                // React to the new phone parameter
                if (this.calls) {
                    this.contactsService.getContactsByParamPhone(this.calls).subscribe((data) => {
                        if (data) {
                            console.log('Data exists:', data);
                        } else {
                            console.log('Data does not exist');
                        }
                    });
                }

                // React to the new caller_id parameter
                if (!params['caller_id']) {
                    this.selectedCallTypeId = this.outbound;
                } else {
                    this.selectedCallTypeId = this.inbound;
                }

                console.log('contactNumParams: ', this.contactNumParams);
                localStorage.setItem('contactNum', this.contactNum);
                if (this.caseId) {
                    setTimeout(() => {
                        const offcanvasElement = document.getElementById('offcanvasRight');
                        if (offcanvasElement) {
                            const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
                            offcanvas.show();
                            this.editCall(this.caseId);
                        }
                    }, 500);
                }

                if (this.contactId && (this.chatType || this.chatId)) {
                    setTimeout(() => {
                        this.createCall();
                        setTimeout(() => {
                            const offcanvasElement = document.getElementById('offcanvasRight');
                            if (offcanvasElement) {
                                const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
                                offcanvas.show();
                            }
                        }, 100);
                    }, 500);
                }
            });
        }

        if (this.contactId) {
            this.TableShowing = true;
            this.SearchButton = false;
        } else {
            this.TableShowing = false;
            this.SearchButton = true;
        }

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.userRole = userData.role.roleTitle.toLocaleLowerCase();

        this.selectedFilter = 'all';
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        }
        this.connect();

        const now = new Date();
        this.timepickStart = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };

        this.callTypes = [
            { id: '1', name: this.inbound },
            { id: '2', name: this.outbound },
        ];

        this.getStatusList();
        this.getCallStatus();
        this.getSentiments();
        this.getContactGroup();

        if(this.chatId && this.chatId !== '') {
          this.getContactChatId(this.chatId);
        }
    }

    getStatusList() {
        this.callListService.getStatusList().subscribe((res: any) => {
            this.statusList = res;
            console.log('Status List:', this.statusList);
        });
    }

    checkRole(): boolean {
        return true;
    }

    getComment(caseId: string) {
        this.callListService.getComment(caseId).subscribe((res: any) => {
            this.comments = res;
        });
    }

    async getContactById(contactId: string) {
        await this.contactsService.getContactsById(contactId).subscribe((res: any) => {
            this.detailItem = res[0];
            this.contactFirstName = this.detailItem.firstName;
            this.contactLastName = this.detailItem.lastName;
            this.contactGender = this.detailItem.gender || 'unknown';
            this.contactOrg = this.detailItem.organization_id;
            this.contactType = this.detailItem.contact_type;
            this.contactNum = this.detailItem.contactNumber;
            this.contactProvince = this.detailItem.province;
            this.contactCreatedByID = this.detailItem.create_by;
            this.contactCreatedAt = this.detailItem.created_at;
            this.contactModifiedByID = this.detailItem.modified_by;
            this.contactModifiedAt = this.detailItem.modified_at;
            this.contactEmail = this.detailItem.email;
            this.partnerCode = this.detailItem.partnerCode;
            this.contactGroupId = this.detailItem.contactGroupId;
            this.contactChatDisplayName = this.detailItem.chatDisplayName || '';

            if (this.contactOrg != '' && this.contactOrg != null && this.contactOrg != undefined) {
                this.contactsService.getOrganizationById(this.contactOrg).subscribe((res: any) => {
                    this.contactOrgName = res[0].orgName;
                });
            }
        });

        await this.contactsService.getContactCall(contactId).subscribe((res: any) => {
            this.contactCall = res;
        });

        await this.callServive.getContactNumbertById(contactId).subscribe((res: any) => {
            this.contactNumbers =
                res && Array.isArray(res)
                    ? res.map((item: any) => ({
                          contactNumber: item.contactNumber,
                          contactNumberId: item.contactNumberId,
                      }))
                    : [];
        });
    }

    prev() {
        this.router.navigate(['/contacts']);
        this.state = '';
    }

    submit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        // if (userData && this.contactId && this.contactId !== '' && this.contact.components.length > 1) {
        if (this.contactNum || this.contactNum2 || this.contactNumNew || this.chatId) {
            if (this.detailItem && this.state != 'copy') {
                // Create or get organization if organization name is provided
                let organizationId = this.contactOrg;
                if (this.contactOrgName && this.contactOrgName.trim() !== '' && (!this.contactOrg || this.contactOrg === '')) {
                    this.contactsService
                        .createOrg({
                            name: this.contactOrgName,
                            identification: '',
                            createdById: userData.userId,
                        })
                        .subscribe((orgRes: any) => {
                            organizationId = orgRes.organizationId;
                            this.submitEditContact(organizationId, userData);
                        });
                    return;
                } else {
                    this.submitEditContact(organizationId, userData);
                }
            } else {
                // Create or get organization if organization name is provided
                let organizationId = this.contactOrg;
                if (this.contactOrgName && this.contactOrgName.trim() !== '') {
                    this.contactsService
                        .createOrg({
                            name: this.contactOrgName,
                            identification: '',
                            createdById: userData.userId,
                        })
                        .subscribe((orgRes: any) => {
                            organizationId = orgRes.organizationId;
                            this.submitContact(organizationId, userData);
                        });
                    return;
                } else {
                    this.submitContact(organizationId, userData);
                }
            }
        }
    }

    submitEditContact(organizationId: string, userData: any) {
        const data = {
            contactId: this.contactId,
            firstName: this.contactFirstName,
            lastName: this.contactLastName,
            organizationId: organizationId,
            contactType: this.contactType,
            contactNumber: this.contactNum,
            contactNumber2: this.contactNum2,
            province: this.contactProvince,
            gender: this.contactGender || 'unknown',
            modifiedById: userData.userId,
            contactNumNew: this.contactNumNew,
            contactGroupId: this.contactGroupId,
            email: this.contactEmail,
        };
        console.log('data: ', data);
        this.contactsService
            .editContacts(data)
            .pipe(
                tap((res: any) => {
                    this.sweetalertServices.success('alert.saveSuccess', '/contacts/edit', {
                        key: res.contactId,
                    });
                    this.auditLogService.log('', 'Contact', '', 'Edit Contact', JSON.stringify(data), 'Success');
                    if (this.contactId === res.contactId) {
                        location.reload();
                    }
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    this.auditLogService.log('', 'Contact', '', 'Edit Contact', JSON.stringify(data), `Failed, Error : ${error}`);
                    throw error;
                }),
            )
            .subscribe();
    }

    submitContact(organizationId: string, userData: any) {
        const data = {
            firstName: this.contactFirstName,
            lastName: this.contactLastName,
            organizationId: organizationId,
            contactType: this.contactType,
            contactNumber: this.contactNum,
            province: this.contactProvince,
            gender: this.contactGender || 'unknown',
            createdById: userData.userId,
            contactNumber2: this.contactNum2,
            chatId: this.chatId,
            uuidLine: this.uuidLine,
            chatType: this.chatType,
            displayName: this.displayName,
            issue: this.issue,
            contactGroupId: this.contactGroupId,
            email: this.contactEmail,
        };
        this.contactsService
            .createContacts(data)
            .pipe(
                tap((res: any) => {
                    if (res.success === true) {
                        // console.log('phone: ', res.contactNumber);
                        // console.log('chatId: ', res.chatId);
                        // console.log('uuidLine: ', res.uuidLine);
                        const contactId = res.contactId;
                        const contactNumber = data.contactNumber;
                        const chatId = data.chatId;
                        const chatType = data.chatType;
                        const displayName = data.displayName;
                        const issue = data.issue;
                        const uuidLine = data.uuidLine;

                        Swal.fire({
                            icon: 'success',
                            title: this.translate.instant('alert.saveSuccess'),
                            showConfirmButton: false,
                            timer: 1000,
                            timerProgressBar: true,
                        }).then(() => {
                            this.auditLogService.log('', 'Contact', '', 'Create Contact', JSON.stringify(data), `Success`);
                            const params = new URLSearchParams({
                                key: contactId,
                                call_id: contactNumber || '',
                                chatid: chatId || '',
                                chattype: chatType || '',
                                displayName: displayName || '',
                                issue: issue || '',
                                uuidLine: uuidLine || '',
                            });
                            window.location.href = `${environment.subPath}/contacts/edit?${params.toString()}`;
                        });
                    } else if (res.success === false && res.message === 'Duplicate' && this.MultiNumber === false) {
                        if (res.duplicates.length > 0) {
                            const duplicatedFields = [...new Set(res.duplicates.map((dup: any) => dup.duplicateOn))].join(' และ ');
                            this.sweetalertServices.contactSwal(
                                'error',
                                this.translate.instant('alert.duplicateField', { field: duplicatedFields }),
                                res.duplicates,
                                {
                                    chatid: this.chatId,
                                    chattype: this.chatType,
                                    displayName: this.displayName,
                                    issue: this.issue,
                                    uuidLine: this.uuidLine
                                }
                            );
                            return;
                        }
                        this.auditLogService.log(
                            '',
                            'Contact',
                            '',
                            'Create Contact',
                            JSON.stringify(data),
                            `Failed, Error Duplicate: ${res.duplicates}`,
                        );
                    } else if (res.success === false && res.message === 'Duplicate' && this.MultiNumber === true) {
                        // Find existing contact by phone number or name
                        const existingContact = res.duplicates && res.duplicates.length > 0 ? res.duplicates[0] : null;
                        if (existingContact && existingContact.contactId) {
                            const updateData: any = {
                                contactId: existingContact.contactId,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                gender: data.gender,
                                organizationId: data.organizationId,
                                contactType: data.contactType,
                                contactNumber: data.contactNumber,
                                contactNumber2: data.contactNumber2,
                                province: data.province,
                                modifiedById: data.createdById, // Use createdById as modifiedById for duplicate case
                                contactNumNew: '', // Empty for duplicate case
                                allowDuplicate: true,
                            };
                            this.contactsService
                                .editContacts(updateData)
                                .pipe(
                                    tap((res: any) => {
                                        const contactId = res.contactId;
                                        const contactNumber = updateData.contactNumber;
                                        const chatId = data.chatId;
                                        console.log('contactNumber: ', contactNumber);
                                        this.router.navigate(['/contacts/edit'], {
                                            queryParams: { key: contactId, call_id: contactNumber, chatid: chatId },
                                        });
                                        this.auditLogService.log('', 'Contact', '', 'Edit Contact', JSON.stringify(updateData), 'Success');
                                    }),
                                    catchError((error) => {
                                        this.sweetalertServices.handleError(error);
                                        this.auditLogService.log(
                                            '',
                                            'Contact',
                                            '',
                                            'Edit Contact',
                                            JSON.stringify(updateData),
                                            `Failed, Error : ${error}`,
                                        );
                                        throw error;
                                    }),
                                )
                                .subscribe();
                        }
                    }
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    this.auditLogService.log('', 'Contact', '', 'Create Contact', JSON.stringify(data), `Failed, Error : ${error}`);
                    throw error;
                }),
            )
            .subscribe();
    }

    formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    formatTime(time: any): string {
        const hour = time.hour;
        const minute = time.minute;
        const second = time.second;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }

    onTimepickStartChange(event: any) {
        if (event) {
            const hour = event.hour;
            const minute = event.minute;
            const second = event.second;

            const formattedTimeStartPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
                .toString()
                .padStart(2, '0')}`;

            this.newDateTime = `${this.formatDate(new Date())} ${formattedTimeStartPick}`;
        } else {
            this.newDateTime = this.formatDate(new Date());
        }
    }

    onChannelChange(event: any) {
        this.currentChannel = event;
        console.log('currentChannel:', this.currentChannel);

        if (event === '1') {
            this.selectedCallTypeId = this.outbound;
        } else if (event && event !== '3') {
            this.selectedCallTypeId = this.inbound;
        }
    }

    showAddCall() {
        this.selectedChannels = '';
        this.AddCallShowing = true;

        this.callServive.getCaseCode().subscribe((caseCodes: any) => {
            this.caseCodes = caseCodes;
            this.filteredCodes = caseCodes;
        });

        this.callServive.getCaseType().subscribe((caseTypes: any) => {
            this.caseTypes = caseTypes;
            this.filteredCaseTypes = caseTypes;
        });

        this.callServive.getCaseServiceGroup().subscribe((serviceGroups: any) => {
            this.serviceGroups = serviceGroups;
            this.filteredServiceGroups = serviceGroups;
        });

        this.callServive.getCaseServiceType().subscribe((serviceTypes: any) => {
            this.serviceTypes = serviceTypes;
            this.filteredServiceTypes = serviceTypes;
        });

        this.callServive.getServiceSubType().subscribe((serviceSubTypes: any) => {
            this.serviceSubTypes = serviceSubTypes;
            this.filteredServiceSubTypes = serviceSubTypes;
        });

        this.callServive.getAllChannels().subscribe((channels: any) => {
            this.channels = channels;
            this.selectedChannels = this.currentChannel || '';
            if (this.chatType) {
                const chatTypeLower = this.chatType.toLowerCase().trim();
                const matchedChannel = channels.find((channel: any) => channel.name.toLowerCase().includes(chatTypeLower));
                if (matchedChannel) {
                    this.selectedChannels = matchedChannel.channelId;
                    this.currentChannel = matchedChannel.channelId;
                } else {
                    this.selectedChannels = this.currentChannel || '';
                }
            } else {
                this.selectedChannels = this.currentChannel || '';
            }

            if (this.selectedChannels === '1') {
                this.selectedCallTypeId = this.outbound;
            } else if (this.selectedChannels && this.selectedChannels !== '3') {
                this.selectedCallTypeId = this.inbound;
            }
        });

        this.getContactNumber(this.contactId);
    }

    onFileSelected(event: any) {
        const files = event.target.files;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filename = file.name;

            this.attachmentService
                .upload(file, filename, createdAt, this.userData?.userId || '')
                .pipe(
                    tap((response: any) => {
                        Swal.fire({
                            icon: 'success',
                            title: this.translate.instant('alert.uploadSuccess'),
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        }).then(() => {});
                        this.attachments.push(response);
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        throw error;
                    }),
                )
                .subscribe(() => {});
        }
    }

    createCall() {
        this.currentChannel = '';
        this.attachmentShowing = true;
        this.cType = '';
        this.callId = '';
        this.selectedChannels = '';
        const date = new Date();
        this.startTime = date.toISOString().split('T')[0];
        this.description = '';
        this.solutions = '';
        this.selectedCallTypeId = '';
        this.timepickStart = {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
        };
        this.selectedCaseCode = null;
        this.selectedCaseCodeObject = null;
        this.selectedCaseType = null;
        this.selectedServiceGroup = null;
        this.selectedServiceType = null;
        this.selectedServiceSubType = null;

        // Reset contact number and status
        this.selectedContactNumber = null;
        this.selectedStatus = '';
        this.selectedCallStatusId = 0;
        this.selectedSentiment = null;
        this.comment = '';
        this.comments = [];
        this.history = [];

        this.chatId = this.originalChatId;
        this.chatType = this.originalChatType;

        // Reset autocomplete controls
        this.codeControl.setValue('');
        this.codeControl.enable();
        this.caseTypeControl.setValue('');
        this.caseTypeControl.enable();
        this.serviceGroupControl.setValue('');
        this.serviceGroupControl.enable();
        this.serviceTypeControl.setValue('');
        this.serviceTypeControl.enable();
        this.serviceSubTypeControl.setValue('');
        this.serviceSubTypeControl.enable();
        this.isStatusDisabled = false;
        this.isChannelDisabled = false;
        this.isCallTypeDisabled = false;
        this.isContactNumberDisabled = false;
        this.isDateDisabled = false;
        this.isDescriptionDisabled = false;
        this.isCommentsHistoryShowing = false;

        this.showAddCall();
    }

    editCall(caseId: string, openOffcanvas: boolean = false) {
        this.currentChannel = '';
        this.attachmentShowing = false;
        console.log('Edit Case:', caseId);
        this.cType = '';
        this.callId = '';
        this.selectedChannels = '';
        this.startTime = '';
        this.description = '';
        this.solutions = '';
        this.selectedCallTypeId = '';
        this.selectedStatus = null;
        this.selectedContactNumber = null;
        const date = new Date();
        this.timepickStart = {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
        };
        this.selectedCaseCode = null;
        this.selectedCaseCodeObject = null;
        this.selectedCaseType = null;
        this.selectedServiceGroup = null;
        this.selectedServiceType = null;
        this.selectedServiceSubType = null;

        this.isStatusDisabled = false;
        this.isChannelDisabled = true;
        this.isCallTypeDisabled = true;
        this.isContactNumberDisabled = true;
        this.isDateDisabled = true;
        this.isDescriptionDisabled = false;
        this.isCommentsHistoryShowing = true;

        this.codeControl.disable();
        // this.caseTypeControl.disable();
        // this.serviceGroupControl.disable();
        // this.serviceTypeControl.disable();
        // this.serviceSubTypeControl.disable();
        this.callServive.getContactNumbertById(this.contactId).subscribe((contactNumbers: any) => {
            if (contactNumbers && Array.isArray(contactNumbers) && contactNumbers.length > 0) {
                this.contactNumber = contactNumbers;
            }

            this.callServive.getCaseById(caseId).subscribe(
                (call: any) => {
                    console.log('Edit Call: ', call);
                    this.cType = 'case';
                    this.callId = call.caseId;
                    this.description = call.description;
                    this.solutions = call.solution || '';
                    this.selectedStatus = call.statusId;
                    this.originalStatus = call.statusId;
                    this.selectedCallStatusId = call.callStatus;
                    this.originalCallStatusId = call.callStatus;
                    this.selectedSentiment = call.sentimentId;
                    this.startTime = call.requestDateTime;
                    const date = new Date(call.requestDateTime);
                    this.timepickStart = {
                        hour: date.getHours(),
                        minute: date.getMinutes(),
                        second: date.getSeconds(),
                    };
                    this.selectedChannels = call.channelId;
                    this.currentChannel = call.channelId;
                    this.selectedCallTypeId = call.operationType;
                    this.selectedStatus = call.statusId;

                    if (call.contactNumber && call.contactNumberId) {
                        this.selectedContactNumber = {
                            contactNumber: call.contactNumber,
                            contactNumberId: call.contactNumberId,
                        };
                    }
                    console.log('call: ', call);
                    if (call.caseCodeId) {
                        this.selectedCaseCode = call.caseCodeId;
                        // Set codeControl value for autocomplete
                        const selectedCode = this.caseCodes.find((code: any) => code.id == call.caseCodeId);
                        if (selectedCode) {
                            this.codeControl.setValue(selectedCode);
                            this.selectedCaseCodeObject = selectedCode;
                        }
                    } else {
                        this.selectedCaseCode = null;
                        this.selectedCaseCodeObject = null;
                        this.codeControl.setValue('');
                    }

                    if (call.chatId) {
                        this.chatId = call.chatId;
                    }

                    if (call.caseTypeId) {
                        this.selectedCaseType = call.caseTypeId;
                        // Set caseTypeControl value for autocomplete
                        const selectedCaseType = this.caseTypes.find((type: any) => type.id == call.caseTypeId);
                        if (selectedCaseType) {
                            this.caseTypeControl.setValue(selectedCaseType);
                        }
                    } else {
                        this.selectedCaseType = null;
                        this.caseTypeControl.setValue('');
                    }

                    if (call.caseServiceGroupId) {
                        this.selectedServiceGroup = call.caseServiceGroupId;
                        // Set serviceGroupControl value for autocomplete
                        const selectedServiceGroup = this.serviceGroups.find((group: any) => group.id == call.caseServiceGroupId);
                        if (selectedServiceGroup) {
                            this.serviceGroupControl.setValue(selectedServiceGroup);
                        }
                    } else {
                        this.selectedServiceGroup = null;
                        this.serviceGroupControl.setValue('');
                    }

                    if (call.caseServiceTypeId) {
                        this.selectedServiceType = call.caseServiceTypeId;
                        // Set serviceTypeControl value for autocomplete
                        const selectedServiceType = this.serviceTypes.find((type: any) => type.id == call.caseServiceTypeId);
                        if (selectedServiceType) {
                            this.serviceTypeControl.setValue(selectedServiceType);
                        }
                    } else {
                        this.selectedServiceType = null;
                        this.serviceTypeControl.setValue('');
                    }

                    if (call.caseServiceSubTypeId) {
                        this.selectedServiceSubType = call.caseServiceSubTypeId;
                        // Set serviceSubTypeControl value for autocomplete
                        const selectedServiceSubType = this.serviceSubTypes.find((subType: any) => subType.id == call.caseServiceSubTypeId);
                        if (selectedServiceSubType) {
                            this.serviceSubTypeControl.setValue(selectedServiceSubType);
                        }
                    } else {
                        this.selectedServiceSubType = null;
                        this.serviceSubTypeControl.setValue('');
                    }

                    this.getComment(caseId);
                    this.getChatHistory(call.chatId);
                    this.getCallStatusId(this.selectedCallStatusId?.toString() || '');
                    this.getHistory(caseId);
                },
                (error) => {
                    console.error('Error fetching case:', error);
                },
            );
        });

        this.showAddCall();

        if (openOffcanvas) {
            setTimeout(() => {
                const offcanvasElement = document.getElementById('offcanvasRight');
                if (offcanvasElement) {
                    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
                    offcanvas.show();
                }
            }, 500);
        }
    }

    deleteCall(callId: string) {
        console.log('Delete Call:', callId);
        Swal.fire({
            icon: 'warning',
            title: this.translate.instant('alert.deleteConfirm'),
            showCancelButton: true,
            confirmButtonText: this.translate.instant('alert.ok'),
            cancelButtonText: this.translate.instant('alert.cancel'),
            confirmButtonColor: '#3066be',
            cancelButtonColor: '#ec5365',
            width: '50%',
        }).then((result) => {
            if (result.isConfirmed) {
                this.contactsService.deleteCall(callId).subscribe(
                    (res: any) => {
                        this.sweetalertServices.success('alert.deleteSuccess');
                        this.auditLogService.log(
                            '',
                            'Contact',
                            callId,
                            `Delete Call From ContactID : ${this.contactId}`,
                            `Call ID : ${callId}`,
                            `Success`,
                        );
                        window.location.reload();
                    },
                    (error: any) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Contact',
                            callId,
                            `Delete Call From ContactID : ${this.contactId}`,
                            `Call ID : ${callId}`,
                            `Failed, Error : ${error}`,
                        );
                    },
                );
            }
        });
    }

    submitCall() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        const selectedDate = this.startTime ? this.formatDate(new Date(this.startTime)) : this.formatDate(new Date());
        const now = new Date();
        const defaultTime = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };
        const selectedTime = this.timepickStart ? this.formatTime(this.timepickStart) : this.formatTime(defaultTime);

        if (!this.callId) {
            // Create new case
            if (this.selectedCaseCode || this.chatId || this.chatType) {
                // Format requestDateTime
                const requestDateTime = `${selectedDate} ${selectedTime}`;

                // Get current timestamp for createdAt and modifiedAt
                const nowISO = new Date().toISOString();

                const dataForm = {
                    caseId: null,
                    contactId: this.contactId,
                    channelId: this.selectedChannels,
                    requestDateTime: requestDateTime,
                    description: this.description,
                    caseCodeId: this.selectedCaseCode,
                    caseTypeId: this.selectedCaseType,
                    caseServiceGroupId: this.selectedServiceGroup,
                    caseServiceTypeId: this.selectedServiceType,
                    caseServiceSubTypeId: this.selectedServiceSubType,
                    operationType: this.selectedCallTypeId,
                    priority: null,
                    status: this.selectedStatus,
                    callStatus: this.selectedCallStatusId,
                    sentimentId: this.selectedSentiment,
                    solution: this.solutions,
                    contactNumber: this.selectedContactNumber ? this.selectedContactNumber.contactNumberId : null,
                    source: null,
                    assignedAt: null,
                    createdAt: nowISO,
                    createdById: userData.userId,
                    modifiedAt: nowISO,
                    modifiedById: null,
                    isDeleted: 0,
                    assignedUserId: null,
                    attachment: this.attachmentsId,
                    comment: this.comment,
                    chatId: this.contactChatId,
                    uuidLine: this.uuidLine,
                    chatType: this.chatType,
                    firstName: this.displayName,
                };
                console.log('Create Case Data: ', dataForm);

                this.callServive
                    .createCase(dataForm)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.success('alert.saveSuccess');
                            this.auditLogService.log(
                                '',
                                'Contact Create Case',
                                this.caseId,
                                'Contact Create Case',
                                JSON.stringify(dataForm),
                                `Success`,
                            );
                            window.location.href = `${environment.subPath}/contacts/edit?key=${this.contactId}`;
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Create Case',
                                this.caseId,
                                'Contact Create Case',
                                JSON.stringify(dataForm),
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.error('alert.pleaseEnterTopic');
            }
        } else if (this.callId && this.cType === 'case') {
            // Update existing case
            // console.log('iiiiiiiiiiiiiiiiii Edit Case:', this.callId);
            if (this.selectedCaseCode || this.chatId || this.chatType) {
                const data = {
                    callId: this.callId,
                    caseCodeId: this.selectedCaseCode,
                    caseTypeId: this.selectedCaseType,
                    caseServiceGroupId: this.selectedServiceGroup,
                    caseServiceTypeId: this.selectedServiceType,
                    caseServiceSubTypeId: this.selectedServiceSubType,
                    channel: this.selectedChannels,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    modifiedById: userData.userId,
                    operationType: this.selectedCallTypeId,
                    contactId: this.contactId,
                    status: this.selectedStatus,
                    comment: this.comment,
                    callStatus: this.selectedCallStatusId,
                    sentimentId: this.selectedSentiment,
                    statusChangedAt: this.selectedCallStatusId !== this.originalCallStatusId ? new Date().toISOString() : null,
                    statusChange:
                        this.selectedStatus !== this.originalStatus
                            ? {
                                  from: this.originalStatus,
                                  to: this.selectedStatus,
                                  changedAt: new Date().toISOString(),
                                  changedBy: userData.userId,
                              }
                            : null,
                };
                console.log('Update Case Data: ', data);
                this.callServive
                    .updateCase(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.success('alert.saveSuccess');
                            this.auditLogService.log(
                                '',
                                'Contact Update Case',
                                this.callId,
                                'Contact Update Case ',
                                JSON.stringify(data),
                                `Success`,
                            );
                            window.location.href = `${environment.subPath}/contacts/edit?key=${this.contactId}`;
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Update Case',
                                this.callId,
                                'Contact Update Case',
                                JSON.stringify(data),
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.error('alert.pleaseEnterTopic');
            }
        }
    }

    connect(): void {
        console.log('connect');
        const url = environment.urlWebSocket.urlQAgent;
        this.socket$ = new WebSocketSubject({
            url: url,
            serializer: (value) => {
                try {
                    console.log('Serializing message:', value);
                    return value;
                } catch (error) {
                    console.error('WebSocket message error:', error);
                    throw error;
                }
            },
            deserializer: (event) => {
                try {
                    console.log('Deserializing message:', event.data);
                    return event.data;
                } catch (error) {
                    console.error('WebSocket message error:', error);
                    throw error;
                }
            },
        });
        console.log('url:' + url);

        this.socket$
            .pipe(
                tap(() => {
                    this.results.push('CONNECTED');
                    this.connected = true;
                }),
                catchError((error) => {
                    console.error('WebSocket connection error:', error);
                    this.results.push('WebSocket connection error: ' + error);
                    this.connected = false;
                    return [];
                }),
                finalize(() => {
                    console.log('WebSocket connection closed');
                    this.results.push('WebSocket connection closed');
                    this.connected = false;
                    if (this.socket$) {
                        this.socket$.unsubscribe();
                    }
                }),
            )
            .subscribe(
                () => {},
                (error) => {
                    console.error('Unexpected WebSocket error:', error);
                    this.results.push('Unexpected WebSocket error: ' + error);
                    this.connected = false;
                },
            );
    }

    sendMessage(): void {
        console.log('send');
        const cleanedPhoneCall = this.selectedContactNumber?.contactNumber?.trim().replace(/"/g, '') || '';
        const messageToSend = `${environment.urlWebSocket.dialPrefix}${cleanedPhoneCall}`;

        console.log('messageToSend: ', messageToSend);

        if (this.socket$) {
            if (this.socket$.closed) {
                this.connect();
            } else {
                if (messageToSend.trim() !== '') {
                    this.socket$.next(messageToSend);
                    this.results.push(messageToSend);
                    console.log(messageToSend);
                } else {
                    console.error('Empty message cannot be sent.');
                }
            }
        } else {
            console.error('WebSocket is not initialized.');
        }

        console.log('results: ', this.results);
        console.log('results: ', this.results[1]);
    }

    disconnect(): void {
        this.connected = false;

        if (this.socket$) {
            console.log('hangup');
            this.socket$.next('hangup');
            this.socket$.unsubscribe();
            this.connected = false;
        }
    }

    onInputChange(event: any, index: string) {
        let inputValue = event.target.value;

        inputValue = inputValue.replace(/\D/g, '');

        if (index === 'contactNum') {
            this.contactNum = inputValue;
        } else if (index === 'contactNum2') {
            this.contactNum2 = inputValue;
        }
    }

    async getContactNumber(contactId: string) {
        try {
            const contactNumber = (await this.callServive.getContactNumbertById(contactId).toPromise()) as any[];
            console.log('contactNumber Res:', contactNumber);

            if (contactNumber && contactNumber.length > 0) {
                this.contactNumber = contactNumber;
                console.log('contactNumber: ', this.contactNumber);
            } else {
                console.warn('No contact number found for this contactId');
            }
        } catch (error) {
            console.error('Error fetching contact number', error);
        }
    }

    inputAddPhone() {
        this.isInputVisible = !this.isInputVisible;
    }

    filterCodes() {
        const controlValue = this.codeControl.value as any;
        // เก็บค่าต้นฉบับไว้สำหรับสร้างใหม่
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.code : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredCodes = [...this.caseCodes];
            return;
        }

        this.filteredCodes = this.caseCodes.filter((code: any) => code.code.toLowerCase().includes(filterValue));

        // ถ้าไม่พบ exact match ให้เพิ่ม option สร้างใหม่
        const exactMatch = this.caseCodes.find((code: any) => code.code.toLowerCase() === filterValue);

        if (!exactMatch && filterValue) {
            // เพิ่ม option สร้างใหม่ที่ต้นของ list (ใช้ค่าต้นฉบับ)
            this.filteredCodes = [{ id: null, code: originalValue, isNew: true }, ...this.filteredCodes];
        }
    }

    filterCaseTypes() {
        const controlValue = this.caseTypeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredCaseTypes = [...this.caseTypes];
            return;
        }

        this.filteredCaseTypes = this.caseTypes.filter((type: any) => type.name.toLowerCase().includes(filterValue));

        const exactMatch = this.caseTypes.find((type: any) => type.name.toLowerCase() === filterValue);
        if (!exactMatch && filterValue) {
            this.filteredCaseTypes = [{ id: null, name: originalValue, isNew: true }, ...this.filteredCaseTypes];
        }
    }

    filterServiceGroups() {
        const controlValue = this.serviceGroupControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredServiceGroups = [...this.serviceGroups];
            return;
        }

        this.filteredServiceGroups = this.serviceGroups.filter((group: any) => group.name.toLowerCase().includes(filterValue));

        const exactMatch = this.serviceGroups.find((group: any) => group.name.toLowerCase() === filterValue);
        if (!exactMatch && filterValue) {
            this.filteredServiceGroups = [{ id: null, name: originalValue, isNew: true }, ...this.filteredServiceGroups];
        }
    }

    filterServiceTypes() {
        const controlValue = this.serviceTypeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredServiceTypes = [...this.serviceTypes];
            return;
        }

        this.filteredServiceTypes = this.serviceTypes.filter((type: any) => type.name.toLowerCase().includes(filterValue));

        const exactMatch = this.serviceTypes.find((type: any) => type.name.toLowerCase() === filterValue);
        if (!exactMatch && filterValue) {
            this.filteredServiceTypes = [{ id: null, name: originalValue, isNew: true }, ...this.filteredServiceTypes];
        }
    }

    filterServiceSubTypes() {
        const controlValue = this.serviceSubTypeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredServiceSubTypes = [...this.serviceSubTypes];
            return;
        }

        this.filteredServiceSubTypes = this.serviceSubTypes.filter((subType: any) => subType.name.toLowerCase().includes(filterValue));

        const exactMatch = this.serviceSubTypes.find((subType: any) => subType.name.toLowerCase() === filterValue);
        if (!exactMatch && filterValue) {
            this.filteredServiceSubTypes = [{ id: null, name: originalValue, isNew: true }, ...this.filteredServiceSubTypes];
        }
    }

    displayCodeFn = (code: any): string => {
        return code?.code || '';
    };

    displayCaseTypeFn = (caseType: any): string => {
        return caseType?.name || '';
    };

    displayServiceGroupFn = (serviceGroup: any): string => {
        return serviceGroup?.name || '';
    };

    displayServiceTypeFn = (serviceType: any): string => {
        return serviceType?.name || '';
    };

    displayServiceSubTypeFn = (serviceSubType: any): string => {
        return serviceSubType?.name || '';
    };

    onCodeSelected(event: any) {
        const selectedCode = event.option.value;

        if (selectedCode.isNew) {
            // ตรวจสอบว่ามีชื่อซ้ำหรือไม่ (case-insensitive)
            const existingCode = this.caseCodes.find((c: any) => c.code.toLowerCase() === selectedCode.code.toLowerCase());

            if (existingCode) {
                // ถ้ามีอยู่แล้ว ใช้ตัวที่มี
                this.selectedCaseCode = existingCode.id;
                this.selectedCaseCodeObject = existingCode;
                this.codeControl.setValue(existingCode);
                this.filteredCodes = [...this.caseCodes];
                return;
            }

            // สร้าง code ใหม่
            this.callServive
                .createCaseCode({
                    code: selectedCode.code,
                    script: '',
                    createdById: this.userData.userId,
                })
                .subscribe({
                    next: (res: any) => {
                        this.selectedCaseCodeObject = res;
                        this.selectedCaseCode = res.id;
                        this.codeControl.setValue(res);
                        // เพิ่มเข้า list
                        this.caseCodes.push(res);
                        // Refresh filtered list เพื่อลบ option สร้างใหม่
                        this.filteredCodes = [...this.caseCodes];
                        this.sweetalertServices.success('alert.createSuccess');
                    },
                    error: (err) => {
                        console.error('Error creating case code:', err);
                        this.sweetalertServices.error('alert.error');
                    },
                });
        } else {
            // เลือก code ที่มีอยู่แล้ว
            this.selectedCaseCode = selectedCode.id;
            this.selectedCaseCodeObject = selectedCode;
        }
    }

    onCaseTypeSelected(event: any) {
        const selectedCaseType = event.option.value;

        if (selectedCaseType.isNew) {
            // ตรวจสอบว่ามีชื่อซ้ำหรือไม่ (case-insensitive)
            const existingCaseType = this.caseTypes.find((t: any) => t.name.toLowerCase() === selectedCaseType.name.toLowerCase());

            if (existingCaseType) {
                this.selectedCaseType = existingCaseType.id;
                this.caseTypeControl.setValue(existingCaseType);
                this.filteredCaseTypes = [...this.caseTypes];
                return;
            }

            this.callServive
                .createCaseType({
                    name: selectedCaseType.name,
                    createdById: this.userData.userId,
                })
                .subscribe({
                    next: (res: any) => {
                        this.selectedCaseType = res.id;
                        this.caseTypeControl.setValue(res);
                        this.caseTypes.push(res);
                        this.filteredCaseTypes = [...this.caseTypes];
                        this.sweetalertServices.success('alert.createSuccess');
                    },
                    error: (err) => {
                        console.error('Error creating case type:', err);
                        this.sweetalertServices.error('alert.error');
                    },
                });
        } else {
            this.selectedCaseType = selectedCaseType.id;
        }
    }

    onServiceGroupSelected(event: any) {
        const selectedServiceGroup = event.option.value;

        if (selectedServiceGroup.isNew) {
            // ตรวจสอบว่ามีชื่อซ้ำหรือไม่ (case-insensitive)
            const existingServiceGroup = this.serviceGroups.find(
                (g: any) => g.name.toLowerCase() === selectedServiceGroup.name.toLowerCase(),
            );

            if (existingServiceGroup) {
                this.selectedServiceGroup = existingServiceGroup.id;
                this.serviceGroupControl.setValue(existingServiceGroup);
                this.filteredServiceGroups = [...this.serviceGroups];
                return;
            }

            this.callServive
                .createCaseServiceGroup({
                    name: selectedServiceGroup.name,
                    createdById: this.userData.userId,
                })
                .subscribe({
                    next: (res: any) => {
                        this.selectedServiceGroup = res.id;
                        this.serviceGroupControl.setValue(res);
                        this.serviceGroups.push(res);
                        this.filteredServiceGroups = [...this.serviceGroups];
                        this.sweetalertServices.success('alert.createSuccess');
                    },
                    error: (err) => {
                        console.error('Error creating service group:', err);
                        this.sweetalertServices.error('alert.error');
                    },
                });
        } else {
            this.selectedServiceGroup = selectedServiceGroup.id;
        }
    }

    onServiceTypeSelected(event: any) {
        const selectedServiceType = event.option.value;

        if (selectedServiceType.isNew) {
            // ตรวจสอบว่ามีชื่อซ้ำหรือไม่ (case-insensitive)
            const existingServiceType = this.serviceTypes.find((t: any) => t.name.toLowerCase() === selectedServiceType.name.toLowerCase());

            if (existingServiceType) {
                this.selectedServiceType = existingServiceType.id;
                this.serviceTypeControl.setValue(existingServiceType);
                this.filteredServiceTypes = [...this.serviceTypes];
                return;
            }

            this.callServive
                .createCaseServiceType({
                    name: selectedServiceType.name,
                    createdById: this.userData.userId,
                })
                .subscribe({
                    next: (res: any) => {
                        this.selectedServiceType = res.id;
                        this.serviceTypeControl.setValue(res);
                        this.serviceTypes.push(res);
                        this.filteredServiceTypes = [...this.serviceTypes];
                        this.sweetalertServices.success('alert.createSuccess');
                    },
                    error: (err) => {
                        console.error('Error creating service type:', err);
                        this.sweetalertServices.error('alert.error');
                    },
                });
        } else {
            this.selectedServiceType = selectedServiceType.id;
        }
    }

    onServiceSubTypeSelected(event: any) {
        const selectedServiceSubType = event.option.value;

        if (selectedServiceSubType.isNew) {
            // ตรวจสอบว่ามีชื่อซ้ำหรือไม่ (case-insensitive)
            const existingServiceSubType = this.serviceSubTypes.find(
                (st: any) => st.name.toLowerCase() === selectedServiceSubType.name.toLowerCase(),
            );

            if (existingServiceSubType) {
                this.selectedServiceSubType = existingServiceSubType.id;
                this.serviceSubTypeControl.setValue(existingServiceSubType);
                this.filteredServiceSubTypes = [...this.serviceSubTypes];
                return;
            }

            this.callServive
                .createServiceSubType({
                    name: selectedServiceSubType.name,
                    createdById: this.userData.userId,
                })
                .subscribe({
                    next: (res: any) => {
                        this.selectedServiceSubType = res.id;
                        this.serviceSubTypeControl.setValue(res);
                        this.serviceSubTypes.push(res);
                        this.filteredServiceSubTypes = [...this.serviceSubTypes];
                        this.sweetalertServices.success('alert.createSuccess');
                    },
                    error: (err) => {
                        console.error('Error creating service sub type:', err);
                        this.sweetalertServices.error('alert.error');
                    },
                });
        } else {
            this.selectedServiceSubType = selectedServiceSubType.id;
        }
    }

    getChatHistory(chatId: string) {
        this.callListService.getChatHistory(chatId).subscribe((res: any) => {
            this.chatHistory = res;
        });
    }

    getCallStatus() {
        this.callListService.getCallStatus().subscribe((res: any) => {
            this.callStatus = res;
        });
    }

    getSentiments() {
        this.callServive.getSentiment().subscribe((res: any) => {
            this.sentiments = res;
        });
    }

    getCallStatusId(callStatusId: string) {
        this.callListService.getCallStatusId(callStatusId).subscribe((res: any) => {
            this.callStatusId = res;
        });
        // console.log('callStatusId: ', this.callStatusId);
    }

    getHistory(caseId: string) {
        this.callListService.getHistory(caseId).subscribe((res: any) => {
            this.history = res;
        });
    }

    get filteredCallStatus(): any[] {
        if (!this.callStatus) return [];

        if (this.selectedCallTypeId === this.outbound) {
            return this.callStatus.filter((status: any) => status.typeStatus === 'Outbound');
        }

        if (this.selectedCallTypeId === this.inbound) {
            return this.callStatus.filter((status: any) => status.typeStatus === 'Inbound');
        }

        return this.callStatus;
    }

    getContactGroup() {
        this.contactsService.getContactGroup().subscribe((res: any) => {
            console.log('contactGroup: ', res);
            this.contactGroup = res;
        });
    }

  getContactChatId(chatId: string) {
    this.contactsService.getContactChatId(chatId).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.contactChatId = res[0].contactChatId;
        this.contactChatDisplayName = res[0].displayName || '';
      }
    });
  }
}
