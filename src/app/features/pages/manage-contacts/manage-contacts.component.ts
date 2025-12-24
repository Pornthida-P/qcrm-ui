import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { catchError, finalize, tap, switchMap } from 'rxjs';
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
    activityName: string = '';
    isContactSelected: boolean = false;
    typeContact: string[] = ['addComponent', 'saveComponent'];
    contactId: string = '';
    cb: string = '';
    state: string = '';
    detailItem: any = undefined;
    TableShowing: boolean = false;
    AddCallShowing: boolean = false;
    submitButtonShowing: boolean = true;
    SearchButton: boolean = true;
    emptyItem: String = 'ว่าง';

    checkedValues: string[] = [];
    formData: any = {};

    cType: string = '';
    callId: string = '';
    selectedTopics: any;
    casetopics: any[] = [];
    casesubjects: any[] = [];
    selectedCasesubject: any = null;
    selectedCaseTopics: any = null;
    selectedChannels: any;
    currentChannel: any;
    channels: any;
    activitiestype: any;
    solutions: string = '';
    description: string = '';
    combinedDateTimeStart: string = '';
    combinedDateTimeEnd: string = '';
    timepickStart: { hour: number; minute: number; second: number } = { hour: 0, minute: 0, second: 0 };
    activityTypeId: any;
    newDateTime: any;
    startTime: string = '';
    myForm: FormGroup | any;

    timepickEnd = true;
    meridian = true;
    seconds = true;
    seconds1 = true;

    files: File[] = [];
    fileNames: any;
    attachments: Attachment[] = [];
    attachmentsId: string[] | undefined;

    faPenToSquare = faPenToSquare;
    faTrashCan = faTrashCan;
    faArrowRight = faArrowRight;
    faArrowLeft = faArrowLeft;
    faCircleXmark = faCircleXmark;
    faEye = faEye;
    faClipboard = faClipboard;

    visibleRightSideBar: boolean = true;
    visibleLeftSideBar: boolean = true;
    sortId: string = 'createdAt';
    sortOrder: string = 'DESC';
    sortIcon: string = '';

    filterOption!: any[];
    selectedFilter: any | undefined;
    selectedForm: any | undefined;
    readOnlyForm: boolean = false;

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userRole: string = '';
    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;

    calls: string | null | undefined;
    userId: string = '';

    selectedCallTypeId: string = '';
    inbound: string = config.operationType.inbound;
    outbound: string = config.operationType.outbound;
    operationType: any;
    callTypes: any;
    caller_id: string = '';

    private socket$!: WebSocketSubject<any>;
    urlSocket: string = '';
    message: string = '';
    results: string[] = [];
    connected: boolean = false;
    ws: any;
    dialCall: string = '';
    phoneCall: string = '';
    emailTo: string = '';
    // selectedContactNumber: string = '';
    // contactNumbers: any;

    isCheckboxSelected: { [key: number]: boolean } = {};

    attachmentShowing: boolean = false;

    isTopicDisabled: boolean = false;
    isSubjectDisabled: boolean = false;
    isStatusDisabled: boolean = false;
    isChannelDisabled: boolean = false;
    isCallTypeDisabled: boolean = false;
    isContactNumberDisabled: boolean = false;
    isDateDisabled: boolean = false;
    isDescriptionDisabled: boolean = false;

    isCommentsHistoryShowing: boolean = false;

    selectedActivityTopicId: string[] = [];
    searchContactShowing: boolean = false;

    AddContactShowing: boolean = false;

    showOrgSidebar: boolean = false;

    showContactSidebar: boolean = false;

    activityTypeById: any;
    activitiesTopic: any;
    selectedCheckboxIds: any;
    contactNumParams: any;

    contactNumber: any;
    contactNumbers: { contactNumber: string }[] = [];
    selectedContactNumber: { contactNumber: string; contactNumberId: string } | null = null;

    contactNumNew: string = '';

    isInputVisible: boolean = false;

    statusList: any[] = [];
    selectedStatus: any;
    originalStatus: any;
    phoneNumbers: string[] = [''];
    chatId: any;
    chatType: any;
    displayName: any;
    issue: any;
    caseId: any;
    comment: any;
    comments: any[] = [];
    caseTopicId: any;
    selectedCaseTopicObject: any = null;

    chatHistory: any[] = [];
    activeScriptTab: 'script' | 'chat' = 'script';
    callStatus: any;
    selectedCallStatusId: number | null = null;
    originalCallStatusId: number | null = null;
    callStatusId: any;
    history: any;

    // Autocomplete controls
    topicControl = new FormControl('');
    subjectControl = new FormControl('');
    filteredTopics: any[] = [];
    filteredSubjects: any[] = [];

    constructor(
        private _location: Location,
        private contactsService: ContactsService,
        private sweetalertServices: SweetAlertService,
        private activeRoute: ActivatedRoute,
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
        this.subjectControl.disable();
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
                this.chatId = params['chatid'];
                this.chatType = params['chattype'];
                this.displayName = params['displayName'];
                this.issue = params['issue'];
                this.caseId = params['caseId'];

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

    checkSupRole(): boolean {
        if (this.userRole === 'super admin' || this.userRole === 'admin') {
            return true;
        } else {
            return false;
        }
    }

    getComment(caseId: string) {
        this.callListService.getComment(caseId).subscribe((res: any) => {
            this.comments = res;
        });
    }

    getCaseTopicId(caseId: string) {
        this.callListService.getCaseTopicId(caseId).subscribe((res: any) => {
            this.caseTopicId = res;
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
            this.contactNumbers = res.map((item: any) => ({
                contactNumber: item.contactNumber,
                contactNumberId: item.contactNumberId,
            }));
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
            chatType: this.chatType,
            displayName: this.displayName,
            issue: this.issue,
        };

        this.contactsService
            .createContacts(data)
            .pipe(
                tap((res: any) => {
                    if (res.success === true) {
                        console.log('phone: ', res.contactNumber);
                        console.log('chatId: ', res.chatId);
                        const contactId = res.contactId;
                        const contactNumber = data.contactNumber;
                        const chatId = data.chatId;
                        const chatType = data.chatType;
                        const displayName = data.displayName;
                        const issue = data.issue;

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

    showSideBar() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.AddCallShowing = false;
    }

    formatTimepickStart() {
        const startTimepick = new Date();
        startTimepick.setHours(this.timepickStart.hour);
        startTimepick.setMinutes(this.timepickStart.minute);
        startTimepick.setSeconds(this.timepickStart.second);
        const formatTimepickStart = startTimepick.toISOString();
        this.combinedDateTimeStart = formatTimepickStart;

        const hour = startTimepick.getHours();
        const minute = startTimepick.getMinutes();
        const second = startTimepick.getSeconds();

        const formattedTimeStartPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
            .toString()
            .padStart(2, '0')}`;

        this.newDateTime = `${this.formatDate(new Date())} ${formattedTimeStartPick}`;
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

    onCheckboxChange(event: any, activityTypeId: number) {
        this.isCheckboxSelected[activityTypeId] = event.target.checked;
    }

    onChannelChange(event: any) {
        this.currentChannel = event;
        console.log('currentChannel:', this.currentChannel);

        if (event === '1' || event === '2') {
            this.selectedCallTypeId = this.outbound;
        }
    }

    showAddCall() {
        this.selectedChannels = '';
        this.AddCallShowing = true;

        this.callServive.getCaseTopic().subscribe((casetopics: any) => {
            this.casetopics = casetopics;
            this.filteredTopics = casetopics;
        });

        this.callServive.getAllCaseSubjects().subscribe((casesubjects: any) => {
            this.casesubjects = casesubjects;
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
        // this.selectedCasesubject = [];
        this.selectedChannels = '';
        this.activityTypeId = '';
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
        this.selectedCaseTopics = null;
        this.selectedCasesubject = null;
        this.selectedActivityTopicId = [];

        // Reset contact number and status
        this.selectedContactNumber = null;
        this.selectedStatus = '';
        this.selectedCallStatusId = 0;
        this.comment = '';
        this.comments = [];
        this.history = [];
        this.selectedCaseTopicObject = null;

        // Reset autocomplete controls
        this.topicControl.setValue('');
        this.topicControl.enable();
        this.subjectControl.setValue('');
        this.subjectControl.disable();
        this.isTopicDisabled = false;
        this.isSubjectDisabled = false;
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
        this.activityTypeId = '';
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
        this.selectedCaseTopics = null;
        this.selectedCasesubject = null;
        this.selectedActivityTopicId = [];

        this.isTopicDisabled = true;
        this.isSubjectDisabled = true;
        this.isStatusDisabled = false;
        this.isChannelDisabled = true;
        this.isCallTypeDisabled = true;
        this.isContactNumberDisabled = true;
        this.isDateDisabled = true;
        this.isDescriptionDisabled = false;
        this.isCommentsHistoryShowing = true;

        this.topicControl.disable();
        this.subjectControl.disable();

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

                    if (call.caseTopicId) {
                        this.selectedCaseTopics = call.caseTopicId;
                        // หา caseTopic object
                        this.selectedCaseTopicObject = this.casetopics.find((topic: any) => topic.caseTopicId == call.caseTopicId);
                        // Set topicControl value for autocomplete
                        if (this.selectedCaseTopicObject) {
                            this.topicControl.setValue(this.selectedCaseTopicObject);
                        }
                    } else {
                        this.selectedCaseTopics = null;
                        this.selectedCaseTopicObject = null;
                        this.topicControl.setValue('');
                    }

                    if (call.caseSubjectId) {
                        setTimeout(() => {
                            this.selectedCasesubject = call.caseSubjectId;
                            // Set subjectControl value for autocomplete
                            const selectedSubject = this.casesubjects.find((subject: any) => subject.caseSubjectId == call.caseSubjectId);
                            if (selectedSubject) {
                                this.subjectControl.setValue(selectedSubject);
                            }
                        }, 0);
                    } else {
                        this.selectedCasesubject = null;
                        this.subjectControl.setValue('');
                    }
                    this.getComment(caseId);
                    this.getCaseTopicId(call.caseTopicId);
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

        const isChannelOne = this.selectedChannels === '1' || this.selectedChannels === '2' || this.selectedChannels === '3';
        const selectedCallTypeId = isChannelOne ? this.selectedCallTypeId : null;

        if (!this.callId) {
            // Create new case
            if (this.selectedCaseTopics) {
                const caseTopicId = this.selectedCaseTopics;

                // Find caseTopicCode from casetopics array
                const caseTopicCode =
                    caseTopicId && this.casetopics
                        ? this.casetopics.find((topic: any) => topic.caseTopicId === caseTopicId)?.code || null
                        : null;

                const caseSubjectId = this.selectedCasesubject || null;

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
                    caseTopicId: caseTopicId,
                    caseTopicCode: caseTopicCode,
                    caseSubjectId: caseSubjectId,
                    operationType: selectedCallTypeId,
                    priority: null,
                    status: this.selectedStatus,
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
                    chatId: this.chatId,
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
            if (this.selectedCaseTopics) {
                const data = {
                    callId: this.callId,
                    caseTopicId: this.selectedCaseTopics,
                    caseSubject: this.selectedCasesubject,
                    channel: this.selectedChannels,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    modifiedById: userData.userId,
                    operationType: selectedCallTypeId,
                    contactId: this.contactId,
                    status: this.selectedStatus,
                    comment: this.comment,
                    callStatus: this.selectedCallStatusId,
                    statusChangedAt: this.selectedCallStatusId !== this.originalCallStatusId ? new Date().toISOString() : null,
                    statusChange: {
                        from: this.statusList.find((s: any) => s.id === this.originalStatus)?.status || this.originalStatus,
                        to: this.statusList.find((s: any) => s.id === this.selectedStatus)?.status || this.selectedStatus,
                        changedAt: new Date().toISOString(),
                        changedBy: userData.userId,
                    },
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

    toggleCheckbox(activityTopicId: number) {
        const index = this.selectedCheckboxIds.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedCheckboxIds.push(activityTopicId);
        } else {
            this.selectedCheckboxIds.splice(index, 1);
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

    onCaseTopicChange(event: any) {
        this.selectedCasesubject = null;

        if (this.selectedCaseTopics && this.casetopics) {
            this.selectedCaseTopicObject = this.casetopics.find((topic: any) => topic.caseTopicId == this.selectedCaseTopics);
        } else {
            this.selectedCaseTopicObject = null;
        }
    }

    // Autocomplete filter functions
    filterTopics() {
        const filterValue = (this.topicControl.value || '').toString().toLowerCase();
        this.filteredTopics = this.casetopics.filter((topic) => topic.name.toLowerCase().includes(filterValue));
    }

    filterSubjects() {
        const filterValue = (this.subjectControl.value || '').toString().toLowerCase();
        this.filteredSubjects = this.casesubjects.filter(
            (subject) => subject.caseTopicId == this.selectedCaseTopics && subject.name.toLowerCase().includes(filterValue),
        );
    }

    displayTopicFn(topic: any): string {
        return topic && topic.name ? topic.name : '';
    }

    displaySubjectFn(subject: any): string {
        return subject && subject.name ? subject.name : '';
    }

    onTopicSelected(event: any) {
        const selectedTopic = event.option.value;
        this.selectedCaseTopics = selectedTopic.caseTopicId;
        this.selectedCaseTopicObject = selectedTopic;
        this.selectedCasesubject = null;
        this.subjectControl.setValue('');
        this.filterSubjects();

        if (this.hasSubjectsForSelectedTopic) {
            this.subjectControl.enable();
        } else {
            this.subjectControl.disable();
        }
    }

    onSubjectSelected(event: any) {
        const selectedSubject = event.option.value;
        this.selectedCasesubject = selectedSubject.caseSubjectId;
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
        // console.log('callStatus: ', this.callStatus);
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

    get hasSubjectsForSelectedTopic(): boolean {
        if (!this.selectedCaseTopics) return false;
        return this.casesubjects.some((subject) => subject.caseTopicId == this.selectedCaseTopics);
    }
}
