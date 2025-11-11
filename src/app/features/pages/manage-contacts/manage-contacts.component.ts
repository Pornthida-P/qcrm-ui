import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
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

@Component({
    selector: 'app-manage-contacts',
    templateUrl: './manage-contacts.component.html',
    styleUrls: ['./manage-contacts.component.scss'],
})
export class ManageContactsComponent implements OnInit {
    availableEmail: any[] = [];
    AllEmail: any[] = [];
    MultiNumber: boolean = false;
    contactCall: any[] = [];
    contact: any = {};
    contactFirstName: string = '';
    contactLastName: string = '';
    contactIden: string = '';
    oldIden: string = '';
    contactOrg: string = '';
    contactOrgName: string = '';
    contactType: string = '';
    contactEmail: string = '';
    contactNum: string = '';
    contactNum2: string = '';
    contactProvince: string = '';
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
    selectedCasesubject: any;
    selectedCaseTopics: any[] = [];
    selectedChannels: any;
    currentChannel: any;
    channels: any;
    isEmailSubscribed: number = 0;
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

    numberArray = [1, 2, 3, 4, 5];
    selectSubject = 1;

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
    inbound: string = 'Inbound';
    outbound: string = 'Outbound';
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
    selectedEmail: any[] = [];
    email: any;
    emailById: { email: string }[] = [];
    contactEmailNew: string = '';

    contactNumNew: string = '';

    isInputVisible: boolean = false;
    isInputVisibleMail: boolean = false;
    @ViewChild('emailInput') emailInputRef!: ElementRef;

    phoneNumbers: string[] = [''];
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

    async getContactById(contactId: string) {
        await this.contactsService.getContactsById(contactId).subscribe((res: any) => {
            this.detailItem = res[0];
            this.contactFirstName = this.detailItem.firstName;
            this.contactLastName = this.detailItem.lastName;
            this.contactIden = this.detailItem.iden;
            this.oldIden = this.detailItem.iden;
            this.contactOrg = this.detailItem.organization_id;
            this.contactType = this.detailItem.contact_type;
            this.contactEmail = this.detailItem.email;
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

        await this.contactsService.getContactNumberById(contactId).subscribe((res: any) => {
            // this.contactNumbers = res;
            this.contactNumbers = res.map((item: any) => ({
                contactNumber: item.contactNumber || item,
            }));
        });

        await this.contactsService.getEmailById(contactId).subscribe((res: any) => {
            console.log('emailId: ', res);
            this.emailById = res.map((item: any) => ({
                email: item.email || item,
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
        if (this.contactNum || this.contactNum2 || this.contactEmail || this.contactEmailNew || this.contactNumNew) {
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
            identification: this.contactIden,
            organizationId: organizationId,
            contactType: this.contactType,
            email: this.contactEmail,
            emailNew: this.contactEmailNew,
            contactNumber: this.contactNum,
            contactNumber2: this.contactNum2,
            province: this.contactProvince,
            modifiedById: userData.userId,
            oldIdentification: this.oldIden,
            contactNumNew: this.contactNumNew,
        };
        console.log('data: ', data);
        if (this.contactIden !== this.oldIden && this.oldIden != null && this.oldIden != undefined && this.oldIden != '') {
            console.log('oldIden: ', this.oldIden);
            console.log('contactIden: ', this.contactIden);
            this.sweetalertServices
                .confirmSwal('warning', 'Warning', `ทำการบันทึกลงในผู้ใช้ที่มีเลขประจำตัว ${this.contactIden}`, 'Yes', 'No')
                .then((result: { isConfirmed: any }) => {
                    if (result.isConfirmed) {
                        this.contactsService
                            .editContacts(data)
                            .pipe(
                                tap((res: any) => {
                                    this.sweetalertServices.getSwal('success', 'Save data success.', '', false, '/contacts/edit', {
                                        key: res.contactId,
                                    });
                                    this.auditLogService.log('', 'Contact', 'Edit Contact', JSON.stringify(data), 'Success');
                                    if (this.contactId === res.contactId) {
                                        location.reload();
                                    }
                                }),
                                catchError((error) => {
                                    this.sweetalertServices.handleError(error);
                                    this.auditLogService.log(
                                        '',
                                        'Contact',
                                        'Edit Contact',
                                        JSON.stringify(data),
                                        `Failed, Error : ${error}`,
                                    );
                                    throw error;
                                }),
                            )
                            .subscribe();
                    }
                });
        } else {
            this.contactsService
                .editContacts(data)
                .pipe(
                    tap((res: any) => {
                        this.sweetalertServices.getSwal('success', 'Save data success.', '', false, 'contacts/edit/${contactId}', {
                            key: res.contactId,
                        });
                        this.auditLogService.log('', 'Contact', 'Edit Contact', JSON.stringify(data), 'Success');
                        if (this.contactId === res.contactId) {
                            location.reload();
                        }
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log('', 'Contact', 'Edit Contact', JSON.stringify(data), `Failed, Error : ${error}`);
                        throw error;
                    }),
                )
                .subscribe();
        }
    }

    submitContact(organizationId: string, userData: any) {
        const data = {
            firstName: this.contactFirstName,
            lastName: this.contactLastName,
            identification: this.contactIden,
            organizationId: organizationId,
            contactType: this.contactType,
            email: this.contactEmail,
            contactNumber: this.contactNum,
            province: this.contactProvince,
            createdById: userData.userId,
            contactNumber2: this.contactNum2,
        };

        this.contactsService
            .createContacts(data)
            .pipe(
                tap((res: any) => {
                    if (res.success === true) {
                        console.log('phone: ', res.contactNumber);
                        const contactId = res.contactId;
                        const contactNumber = data.contactNumber;
                        this.router.navigate(['/contacts/edit'], { queryParams: { key: contactId, call_id: contactNumber } });
                        this.auditLogService.log('', 'Contact', 'Create Contact', JSON.stringify(data), `Success`);
                    } else if (res.success === false && res.message === 'Duplicate' && this.MultiNumber === false) {
                        if (res.duplicates.length > 0) {
                            const duplicatedFields = [...new Set(res.duplicates.map((dup: any) => dup.duplicateOn))].join(' และ ');
                            this.sweetalertServices.contactSwal('error', `${duplicatedFields}นี้ได้มีการลงทะเบียนแล้ว`, res.duplicates);
                            return;
                        }
                        this.auditLogService.log(
                            '',
                            'Contact',
                            'Create Contact',
                            JSON.stringify(data),
                            `Failed, Error Duplicate: ${res.duplicates}`,
                        );
                    } else if (res.success === false && res.message === 'Duplicate' && this.MultiNumber === true) {
                        this.contactsService
                            .editContacts2(data)
                            .pipe(
                                tap((res: any) => {
                                    const contactId = res.contactId;
                                    const contactNumber = res.contactNumber;
                                    console.log('contactNumber: ', contactNumber);
                                    this.router.navigate(['/contacts/edit'], {
                                        queryParams: { key: contactId, call_id: contactNumber },
                                    });
                                    this.auditLogService.log('', 'Contact', 'Edit Contact', JSON.stringify(data), 'Success');
                                }),
                                catchError((error) => {
                                    this.sweetalertServices.handleError(error);
                                    this.auditLogService.log(
                                        '',
                                        'Contact',
                                        'Edit Contact',
                                        JSON.stringify(data),
                                        `Failed, Error : ${error}`,
                                    );
                                    throw error;
                                }),
                            )
                            .subscribe();
                    }
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    this.auditLogService.log('', 'Contact', 'Create Contact', JSON.stringify(data), `Failed, Error : ${error}`);
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

    toggleEmailSubscription(event: any) {
        this.isEmailSubscribed = event.target.checked ? 1 : 0;
        console.log('email:', this.isEmailSubscribed);
    }

    onCheckboxChange(event: any, activityTypeId: number) {
        this.isCheckboxSelected[activityTypeId] = event.target.checked;
    }

    onChannelChange(event: any) {
        this.currentChannel = event;
        console.log('currentChannel:', this.currentChannel);
    }

    showAddCall() {
        this.selectedChannels = '';
        this.AddCallShowing = true;

        this.callServive.getCaseTopic().subscribe((casetopics: any) => {
            this.casetopics = casetopics;
        });

        this.callServive.getAllCaseSubjects().subscribe((casesubjects: any) => {
            this.casesubjects = casesubjects;
        });

        this.callServive.getAllChannels().subscribe((channels: any) => {
            this.channels = channels;
            this.selectedChannels = this.currentChannel || '';
        });

        this.callServive.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestype = activitiestype.filter((activityType: any) => [1, 43].includes(parseInt(activityType.activityTypeId)));
        });

        this.getEmail(this.contactId);

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
                            title: 'อัพโหลดข้อมูลเรียบร้อยแล้ว',
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
        this.isEmailSubscribed = 0;
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
        this.selectedCaseTopics = [];
        this.selectedCasesubject = [];
        this.selectedActivityTopicId = [];
        this.showAddCall();
    }

    editCall(callId: string, type: string) {
        this.currentChannel = '';
        this.attachmentShowing = false;
        console.log('Edit Call:', callId);
        console.log('Type:', type);
        this.cType = '';
        this.callId = '';
        // this.selectedCasesubject = [];
        this.selectedChannels = '';
        this.isEmailSubscribed = 0;
        this.activityTypeId = '';
        this.startTime = '';
        this.description = '';
        this.solutions = '';
        this.selectedCallTypeId = '';
        const date = new Date();
        this.timepickStart = {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
        };
        this.selectedCaseTopics = [];
        this.selectedCasesubject = [];
        this.selectedActivityTopicId = [];

        if (type === 'call') {
            this.callServive.getCallById(callId).subscribe((call: any) => {
                console.log('Call:', call);
                this.cType = 'call';
                this.callId = call[0].callId;
                // this.selectedCasesubject = call[0].caseSubject;
                this.selectedChannels = call[0].channel;
                this.currentChannel = call[0].channel;
                this.isEmailSubscribed = call[0].emailInfo;
                this.activityTypeId = call[0].activityType;
                this.startTime = call[0].startTime;
                this.description = call[0].description;
                this.solutions = call[0].solution;
                this.selectedCallTypeId = call[0].operationType;
                this.selectedContactNumber = call[0].caller_id;
                this.selectedEmail = call[0].emails;
                const date = new Date(call[0].startTime);
                this.timepickStart = {
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    second: date.getSeconds(),
                };
                // Handle caseTopicIds
                if (call[0].caseTopicId && call[0].caseTopicId !== 'null') {
                    let caseTopicIds = call[0].caseTopicId;
                    if (!Array.isArray(caseTopicIds)) {
                        caseTopicIds = JSON.parse(caseTopicIds);
                    }
                    this.selectSubject = caseTopicIds.length;
                    for (let i = 0; i < this.selectSubject; i++) {
                        if (caseTopicIds[i].length != 0) {
                            this.selectedCaseTopics[i] = caseTopicIds[i].map(String);
                        } else {
                            this.selectedCaseTopics[i] = [];
                        }
                    }
                }

                // Handle caseSubjects
                if (call[0].caseSubject && call[0].caseSubject !== 'null') {
                    let caseSubjects = call[0].caseSubject;
                    if (!Array.isArray(caseSubjects)) {
                        caseSubjects = JSON.parse(caseSubjects);
                    }
                    for (let i = 0; i < this.selectSubject; i++) {
                        if (this.selectedCaseTopics[i].length != 0) {
                            this.selectedCasesubject[i] = caseSubjects[i].map(String);
                        } else {
                            this.selectedCaseTopics[i] = [];
                        }
                    }
                }
            });
        } else if (type === 'case') {
            this.callServive.getCaseById(callId).subscribe((call: any) => {
                this.selectSubject = 1;
                console.log('Case:', call);
                this.cType = 'case';
                this.callId = call.caseId;
                this.description = call.description;
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

                if (call.caseTopicIds && call.caseTopicIds !== 'null') {
                    let caseTopicIds = call.caseTopicIds;
                    if (!Array.isArray(caseTopicIds)) {
                        caseTopicIds = JSON.parse(caseTopicIds);
                    }
                    this.selectedCaseTopics[0] = caseTopicIds.map(String);
                }

                if (call.caseSubjectIds && call.caseSubjectIds !== 'null') {
                    let caseSubjects = call.caseSubjectIds;
                    if (!Array.isArray(caseSubjects)) {
                        caseSubjects = JSON.parse(caseSubjects);
                    }
                    this.selectedCasesubject[0] = caseSubjects.map(String);
                }
            });
        }

        this.showAddCall();
    }

    deleteCall(callId: string, type: string) {
        console.log('Delete Call:', callId);
        console.log('Type:', type);
        Swal.fire({
            icon: 'warning',
            title: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#3066be',
            cancelButtonColor: '#ec5365',
            width: '50%',
        }).then((result) => {
            if (result.isConfirmed) {
                this.contactsService.deleteCall(callId, type).subscribe(
                    (res: any) => {
                        this.sweetalertServices.getSwal('success', 'ลบข้อมูลเรียบร้อยแล้ว', '', false, '');
                        this.auditLogService.log(
                            '',
                            'Contact',
                            `Delete Call From ContactID : ${this.contactId}`,
                            `Call ID : ${callId}, Type : ${type}`,
                            `Success`,
                        );
                        window.location.reload();
                    },
                    (error: any) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Contact',
                            `Delete Call From ContactID : ${this.contactId}`,
                            `Call ID : ${callId}, Type : ${type}`,
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

        if (this.selectedChannels === '3') {
            this.contactNumParams = null;
        }

        if (this.cType === 'call') {
            for (let i = 0; i < this.selectSubject; i++) {
                if (this.selectedCaseTopics[i] == null) {
                    this.selectedCaseTopics[i] = [];
                    this.selectedCasesubject[i] = [];
                } else {
                    if (this.selectedCasesubject[i] == null) {
                        this.selectedCasesubject[i] = [];
                    }
                }
            }
            if (this.selectedCaseTopics.length > this.selectSubject) {
                this.selectedCasesubject = this.selectedCasesubject.slice(0, this.selectSubject);
                this.selectedCaseTopics = this.selectedCaseTopics.slice(0, this.selectSubject);
            }
        }

        if (!this.callId) {
            if (this.selectedCaseTopics.length > 0) {
                const data = {
                    contactId: this.contactId,
                    name: userData.userId,
                    organization: this.contactOrg,
                    caseTopicId: this.selectedCaseTopics,
                    caseSubject: this.selectedCasesubject,
                    channel: this.selectedChannels,
                    emailInfo: this.isEmailSubscribed ? 1 : null,
                    activityType: this.activityTypeId,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    solution: this.solutions,
                    createdById: userData.userId,
                    attachment: this.attachmentsId,
                    call_id: this.contactNumParams || this.selectedContactNumber ? this.selectedContactNumber?.contactNumber : null,
                    contactNumberId: this.selectedContactNumber ? this.selectedContactNumber.contactNumberId : null,
                    caller_id: this.caller_id,
                    operationType: selectedCallTypeId,
                    emails: this.selectedEmail,
                };
                console.log('Data: ', data);
                this.callServive
                    .createCalls(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                            this.auditLogService.log(
                                '',
                                'Contact Create Call',
                                'Contact Create Case Call',
                                JSON.stringify(data),
                                `Success`,
                            );
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Create Call',
                                'Contact Create Case Call',
                                JSON.stringify(data),
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.getSwal('error', 'โปรดกรอกหัวข้อที่ติดต่อ', '', false, '');
            }
        } else if (this.callId && this.cType === 'call') {
            console.log('Edit Call:', this.callId);
            if (this.selectedCaseTopics.length > 0) {
                const data = {
                    callId: this.callId,
                    caseTopicId: this.selectedCaseTopics,
                    caseSubject: this.selectedCasesubject,
                    channel: this.selectedChannels,
                    emailInfo: this.isEmailSubscribed ? 1 : null,
                    activityType: this.activityTypeId,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    solution: this.solutions,
                    modifiedById: userData.userId,
                    operationType: selectedCallTypeId,
                    contactId: this.contactId,
                    callerId: this.selectedContactNumber ? this.selectedContactNumber.contactNumber : null,
                };
                console.log('Data: ', data);
                this.contactsService
                    .updateCalls(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                            this.auditLogService.log(
                                '',
                                'Contact Update Call',
                                'Contact Update Case Call',
                                JSON.stringify(data),
                                `Success`,
                            );
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Update Call',
                                'Contact Update Case Call',
                                JSON.stringify(data),
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.getSwal('error', 'โปรดกรอกหัวข้อที่ติดต่อ', '', false, '');
            }
        } else if (this.callId && this.cType === 'case') {
            console.log('Edit Case:', this.callId);
            if (this.selectedCaseTopics.length > 0) {
                const data = {
                    callId: this.callId,
                    caseTopicId: this.selectedCaseTopics[0],
                    caseSubject: this.selectedCasesubject[0],
                    channel: this.selectedChannels,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    modifiedById: userData.userId,
                    operationType: selectedCallTypeId,
                    contactId: this.contactId,
                };
                console.log('Data: ', data);
                this.contactsService
                    .updateCase(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                            this.auditLogService.log('', 'Contact Update Case', 'Contact Update Case ', JSON.stringify(data), `Success`);
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Update Case',
                                'Contact Update Case',
                                JSON.stringify(data),
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.getSwal('error', 'โปรดกรอกหัวข้อที่ติดต่อ', '', false, '');
            }
        }
    }

    connect(): void {
        console.log('connect');
        const url = config.urlWebSocket.urlQAgent;
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
        const cleanedPhoneCall = this.phoneCall.trim().replace(/"/g, '');
        const messageToSend = `dial|7${cleanedPhoneCall}`;

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

    addTopicAndSubject() {
        if (this.selectSubject < 5) this.selectSubject++;
    }
    removeTopicAndSubject() {
        if (this.selectSubject > 0) this.selectSubject--;
        console.log(this.selectSubject);
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

    async getEmail(contactId: string) {
        try {
            const email = (await this.callServive.getEmailById(contactId).toPromise()) as any[];
            console.log('Email Res:', email);

            if (email && email.length > 0) {
                this.email = email;
                console.log('Email: ', this.email);
            } else {
                console.warn('No Email found for this contactId');
            }
        } catch (error) {
            console.error('Error fetching Email', error);
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

    inputAddEmail() {
        this.isInputVisibleMail = !this.isInputVisibleMail;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.emailInputRef.nativeElement.focus();
            });
        });
    }
}
