import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CallService } from 'src/app/services/call/call.service';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, tap, throwError } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { ContactService } from 'src/app/services/contact/contact.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import * as moment from 'moment';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { Attachment } from 'src/app/shared/interface/attachment.interface';
import Swal from 'sweetalert2';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
@Component({
    selector: 'app-create-call',
    templateUrl: './create-call.component.html',
    styleUrl: './create-call.component.scss',
})
export class CreateCallComponent {
    selectedDate: Date | undefined;
    contactId: string = '';
    casetopics: any[] = [];
    organizations: any;
    contacts: any[] = [];
    casesubjects: any[] = [];
    contactName: string = '';
    status: string = '';
    parentSub: any;
    startTime: string = '';
    endTime: string = '';
    direction: string = '';
    duration: string = '';
    description: string = '';
    timepickStart: { hour: number; minute: number; second: number } = { hour: 0, minute: 0, second: 0 };
    hour: any;
    solutions: string = '';
    contactOrgName: string = '';

    call_id: string = '';
    caller_id: string = '';

    selectedItem: any;
    selectedData: any[] = [];
    detailItem: any;
    combinedDateTimeStart: string = '';
    combinedDateTimeEnd: string = '';
    contactOrg: any;
    selectedTopics: any;
    selectedCasesubject: any;
    selectedCaseTopics: any[] = [];
    selectedChannels: any;
    nameActivityTopic: string = '';
    selectedActivityTopicName: any;

    parent: any = null;

    model: any;
    organizationName: string | undefined;

    myForm: FormGroup | any;
    channels: any;

    visibleRightSideBar: boolean = true;
    visibleLeftSideBar: boolean = true;
    FormShowing: boolean = false;
    SearchFormShowing: boolean = true;
    searchContactShowing: boolean = false;
    AddContactShowing: boolean = false;
    thanks: boolean = false;

    pageSizeOptionContact = [5, 10, 20];
    currentPageCt = 1;
    currentPageContact = 1;
    totalItemContact = 0;
    totalpageContacts = 0;
    pagesToShowContact = 3;
    pageSizeContact = 5;

    pageSizeOptions = [5, 10, 20];
    pageSize = 5;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

    pageSizeOptionOrgs = [5, 10, 20];
    currentPageOganization = 1;
    currentPageOrg = 1;
    totalItemOrgs = 0;
    totalPageOrgs = 0;
    pagesToShowOrg = 3;
    pageSizeOrg = 5;

    pageSizeOptionElns = [5, 10, 20];
    currentPageActivityById = 1;
    currentPageEln = 1;
    totalItemElns = 0;
    totalPageElns = 0;
    pagesToShowEln = 3;
    pageSizeEln = 5;

    pageSizeOptionSmns = [5, 10, 20];
    currentPageSeminar = 1;
    currentPageSmn = 1;
    totalItemSmns = 0;
    totalPageSmns = 0;
    pagesToShowSmn = 3;
    pageSizeSmn = 5;

    SearchOrgShowing: boolean = false;
    valueSearchOrg!: string;

    SearchElearningShowing: boolean = false;
    valueSearchEln!: string;

    SearchSmnShowing: boolean = false;
    valueSearchSmn!: string;

    sortIdEln: string = 'createdAt';
    sortOrderEln: string = 'DESC';
    checkedValueEln: string[] = [];
    AddElnShowing: boolean = false;

    sortIdOrg: string = 'createdAt';
    sortOrderOrg: string = 'DESC';
    checkedValueOrgs: string[] = [];
    AddOrgShowing: boolean = false;

    sortIdSmn: string = 'createdAt';
    sortOrderSmn: string = 'DESC';
    checkedValueSmns: string[] = [];
    AddSmnShowing: boolean = false;

    sortIdContact: string = 'createdAt';
    sortOrderContact: string = 'DESC';

    valueSearch!: string;

    valuesearchContact!: string;
    selectedFilter: any | undefined;
    spareorganizations!: any;

    sortIcon: string = '';

    contactProductType: string = '';
    checkedValueContact: string[] = [];

    faCircleXmark = faCircleXmark;
    sparecontacts: any;

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userId: any;
    activitiestype: any;
    isEmailSubscribed: number = 0;
    contactIdSelect: string = '';
    activityTypeId: any;
    newDateTime: any;
    selectedOrganizationId: string | null = null;

    showOrgSidebar: boolean = false;
    showContactSidebar: boolean = false;
    showActivitySeminarSideBar: boolean = false;
    showActivityElearningSideBar: boolean = false;

    files: File[] = [];
    fileNames: any;
    attachments: Attachment[] = [];
    attachmentsId: string[] | undefined;
    callTypes: any;
    selectedCallTypeId: string = '';

    inbound: string = 'Inbound';
    outbound: string = 'Outbound';
    operationType: any;

    inputActivity: string = '';
    inputActivity_2: string = '';

    isCheckboxSelected: { [key: number]: boolean } = {};

    activityId: string = '';
    activityTypeById: any;
    activitiesTopic: any;

    checkedValueElns: string[] = [];

    selectedOrganizations: string[] = [];
    selectedActivityTopicId: string[] = [];
    selectedActivityTopicIdSmn: string[] = [];
    selectedActivities: any;
    selectedActivitiesSmn: any;
    selectedActivitiesElearning: any;
    activityElearning: any;
    activitySmn: any;
    activityEln: any;
    selectedActivitiesSmnIds: any;
    activitiestypeTopic: any;
    activitiestypeEln: any;
    callIdEdit: any;
    callId: any;
    callFideId: any;
    // pageEln: number | undefined = 0;

    // selectedActivityTopicId: string[] = [];

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private callServive: CallService,
        private sweetalertServices: SweetAlertService,
        private contactService: ContactsService,
        private ngSelectConfig: NgSelectConfig,
        private attachmentService: AttachmentService,
        private auditLogService: AuditLogService,
    ) {
        this.startTime = this.formatDate(new Date());
    }

    prev() {
        this.location.back();
    }

    timepickEnd = true;
    meridian = true;
    seconds = true;
    seconds1 = true;

    date = new FormControl(new Date());
    serializedDate = new FormControl(new Date().toISOString());

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

    formatStartDate() {
        const startDate = new Date(this.startTime);
        this.startTime = this.formatDate(startDate);
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

    ngOnInit(): void {
        this.route.queryParams.subscribe((params: any) => {
            if (!params['caller_id']) {
                this.selectedCallTypeId = this.outbound;
            } else {
                this.selectedCallTypeId = this.inbound;
            }
            this.contactId = params['contactId'];
            this.call_id = params['call_id'];
            this.caller_id = params['caller_id'];
            this.callIdEdit = params['key'];

            console.log('key: ', this.callIdEdit);
        });

        this.callServive.getCaseTopic().subscribe((casetopics: any) => {
            this.casetopics = casetopics;
        });

        this.callServive.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestype = activitiestype.filter((activityType: any) => [1, 43].includes(parseInt(activityType.activityTypeId)));
        });

        this.callServive.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestypeTopic = activitiestype.filter((activityType: any) =>
                [21, 27, 28].includes(parseInt(activityType.activityTypeId)),
            );
        });

        this.callServive.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestypeEln = activitiestype.filter((activityType: any) => [43].includes(parseInt(activityType.activityTypeId)));
        });

        this.callServive.getAllCaseSubjects().subscribe((casesubjects: any) => {
            this.casesubjects = casesubjects;
        });

        this.callServive.getAllChannels().subscribe((channels: any) => {
            this.channels = channels;
        });

        this.callServive.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
        });

        this.callServive.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
        });

        this.myForm = new FormGroup({
            contactId: new FormControl(''),
        });

        this.selectedFilter = 'all';

        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
            console.log('user: ', this.userData.userId);
        }

        this.getFormContact((this.currentPageContact - 1) * this.pageSizeContact, this.pageSizeContact);
        this.getPageContact();
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        // this.getFormEln((this.currentPageEln - 1) * this.pageSizeEln, this.pageSizeEln, this.activityTypeId);
        this.getPageOrg();
        this.getPageEln();

        const now = new Date();
        this.timepickStart = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };

        this.callTypes = [
            { id: '1', name: this.inbound },
            { id: '2', name: this.outbound },
        ];
    }

    submit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        const selectedDate = this.startTime ? this.formatDate(new Date(this.startTime)) : this.formatDate(new Date());
        const selectedTime = this.timepickStart ? this.formatTime(this.timepickStart) : this.formatTime(new Date());

        const isChannelOne = this.selectedChannels === '1';

        const selectedCallTypeId = isChannelOne ? this.selectedCallTypeId : null;

        const selectedActivitiesSmnIds = this.selectedActivitiesSmn
            ? this.selectedActivitiesSmn.map((activity: { activityTopicId: any }) => activity.activityTopicId)
            : null;
        const selectedActivitiesElnIds = this.selectedActivities
            ? this.selectedActivities.map((activity: { activityTopicId: any }) => activity.activityTopicId)
            : null;

        const data = {
            contactId: this.contactIdSelect,
            name: this.contactId,
            organization: this.contactOrg,
            caseTopicId: this.selectedCaseTopics,
            caseSubject: this.selectedCasesubject,
            channel: this.selectedChannels,
            emailInfo: this.isEmailSubscribed ? 1 : null,
            // activityType: this.activityTypeId,
            description: this.description,
            startTime: `${selectedDate} ${selectedTime}`,
            solution: this.solutions,
            createdById: userData.userId,
            attachment: this.attachmentsId,
            caller_id: this.caller_id,
            call_id: this.call_id,
            operationType: selectedCallTypeId,
            activitySmn: selectedActivitiesSmnIds,
            activityEln: selectedActivitiesElnIds,
        };
        this.callServive
            .createCalls(data)
            .pipe(
                tap((res) => {
                    this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '/contacts');
                    this.auditLogService.log(
                        '',
                        'Create Call',
                        'Create Case Call',
                        `Detail Create call : ContactID : ${data.contactId}
                        ,Name : ${data.name}
                        ,StartTime : ${data.startTime}
                        ,Caller_id : ${data.caller_id}
                        ,Call_id : ${data.call_id}
                        ,Type : ${data.operationType}`,
                        `Success`,
                    );
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    this.auditLogService.log(
                        '',
                        'Create Call',
                        'Create Case Call',
                        `Detail Create call : ContactID : ${data.contactId}
                        ,Name : ${data.name}
                        ,StartTime : ${data.startTime}
                        ,Caller_id : ${data.caller_id}
                        ,Call_id : ${data.call_id}
                        ,Type : ${data.operationType}`,
                        `Failed, Error : ${error}`,
                    );
                    throw error;
                }),
            )
            .subscribe();
    }

    submitActivityTopic() {
        if (this.selectedActivityTopicName && this.nameActivityTopic) {
            const isDuplicate = this.activitySmn.some((smn: any) => {
                return smn.activityTopicName === this.nameActivityTopic && smn.activityId === this.selectedActivityTopicName;
            });

            if (!isDuplicate) {
                const data = {
                    activityId: this.selectedActivityTopicName,
                    activityTopicName: this.nameActivityTopic,
                };
                console.log(data);

                this.callServive
                    .createActivityTopic(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                            this.auditLogService.log(
                                '',
                                'Create Call ActivityTopic',
                                'Create Case Call ActivityTopic',
                                `Details ActivityTopic : ActivityTopicId : ${data.activityId},ActivityTopicId : ${data.activityTopicName}`,
                                `Success`,
                            );
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Create Call ActivityTopic',
                                'Create ActivityTopic',
                                `Details ActivityTopic : ActivityTopicId : ${data.activityId}, ActivityTopicId : ${data.activityTopicName}`,
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.getSwal('warning', 'ข้อมูลซ้ำกับข้อมูลที่มีอยู่แล้ว', '', false, '');
            }
        } else {
            this.sweetalertServices.getSwal('warning', 'กรุณาใส่ข้อมูลให้ครบถ้วน', '', false, '');
        }
    }
    showSideBarContact() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.searchContactShowing = true;
        this.thanks = false;
        this.AddContactShowing = false;
        this.showOrgSidebar = false;
        this.showContactSidebar = true;
        this.showActivitySeminarSideBar = false;
        this.showActivityElearningSideBar = false;
    }

    pageSizeChangeContact() {
        this.currentPageCt = 1;
        this.getFormContact((this.currentPageContact - 1) * this.pageSizeContact, this.pageSizeContact);
    }

    async getFormContact(pageContact: number, pageSizeContact: number) {
        await this.callServive
            .getContactByPage(
                pageContact,
                pageSizeContact,
                `${this.sortIdContact},${this.sortOrderContact}`,
                this.valuesearchContact,
                this.selectedFilter,
            )
            .subscribe((res: any) => {
                console.log('API response:', res);
                this.contacts = res;
                this.sparecontacts = res;
                console.log('contact:', this.contacts);
            });
    }

    sortContact(value: string) {
        if (this.sortIdContact == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrderContact = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrderContact = 'ASC';
            }
        } else {
            this.sortIdContact = value;
        }
        this.getFormContact((this.currentPageContact - 1) * this.pageSizeContact, this.pageSizeContact);
    }

    chooseContact(contactsId: string) {
        this.contactIdSelect = contactsId;
        this.callServive.getContactById(contactsId).subscribe((res: any) => {
            this.contactName = `${res[0].firstName} ${res[0].lastName}`;
        });
    }

    async pageChangeContact(pageContact: number) {
        if (pageContact != this.currentPageContact) {
            if (pageContact >= 1 && pageContact <= this.totalpageContacts) {
                this.currentPageContact = pageContact;
                await this.getFormContact((this.currentPageContact - 1) * this.pageSizeContact, this.pageSizeContact);
                this.checkedValueContact = [];
            }
        }
    }

    get pageContacts(): number[] {
        var pageContact: number[] = [];
        this.totalpageContacts = Math.ceil(this.totalItemContact / this.pageSizeContact);
        for (var i = -this.pagesToShowContact; i <= this.pagesToShowContact; i++) {
            if (this.currentPageContact + i > 0 && this.currentPageContact + i <= this.totalpageContacts) {
                pageContact.push(this.currentPageContact + i);
            }
        }
        return pageContact;
    }

    searchContact() {
        console.log('Search Contact:');
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getFormContact((this.currentPageContact - 1) * this.pageSizeContact, this.pageSizeContact);
        this.getPageContact();
    }

    async getPageContact() {
        await this.callServive.countContact(this.valuesearchContact, this.userId).subscribe((res: any) => {
            this.totalItemContact = res.count;
        });
    }

    onCheckboxChange(event: any, activityTypeId: number) {
        this.isCheckboxSelected[activityTypeId] = event.target.checked;
    }

    toggleEmailSubscription(event: any) {
        this.isEmailSubscribed = event.target.checked ? 1 : 0;
    }

    chooseOrg(orgId: string) {
        this.contactOrg = orgId;
        this.contactService.getOrganizationById(orgId).subscribe((res: any) => {
            this.contactOrgName = res[0].orgName;
            // this.contactProductType = res[0].prodName;
        });
    }

    showSideBarOrg() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.thanks = false;
        this.SearchOrgShowing = true;
        this.AddOrgShowing = false;
        this.showOrgSidebar = true;
        this.showContactSidebar = false;
        this.showActivitySeminarSideBar = false;
        this.showActivityElearningSideBar = false;
    }

    pageSizeChangeOrg() {
        this.currentPageOganization = 1;
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
    }

    // pageSizeChangeEln() {
    //     this.currentPageActivityById = 1;
    //     this.getFormEln((this.currentPageEln - 1) * this.pageSizeEln, this.pageSizeEln, this.activityTypeId);
    // }

    sortOrg(value: string) {
        if (this.sortIdOrg == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrderOrg = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrderOrg = 'ASC';
            }
        } else {
            this.sortIdOrg = value;
        }
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
    }

    sortEln(value: string) {
        if (this.sortIdOrg == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrderOrg = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrderOrg = 'ASC';
            }
        } else {
            this.sortIdOrg = value;
        }
        this.getFormEln();
    }

    sortSmn(value: string) {
        if (this.sortIdSmn == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrderSmn = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrderSmn = 'ASC';
            }
        } else {
            this.sortIdSmn = value;
        }
        this.getFormEln();
    }

    async pageChangeOrg(pageOrg: number) {
        if (pageOrg != this.currentPageOrg) {
            if (pageOrg >= 1 && pageOrg <= this.totalPageOrgs) {
                this.currentPageOrg = pageOrg;
                await this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
                this.checkedValueOrgs = [];
            }
        }
    }

    async pageChangeEln(pageEln: number) {
        if (pageEln != this.currentPageEln) {
            if (pageEln >= 1 && pageEln <= this.totalPageElns) {
                this.currentPageEln = pageEln;
                await this.getFormEln();
                this.checkedValueElns = [];
            }
        }
    }

    async pageChangeSmn(pageSmn: number) {
        if (pageSmn != this.currentPageEln) {
            if (pageSmn >= 1 && pageSmn <= this.totalPageSmns) {
                this.currentPageSmn = pageSmn;
                await this.getFormEln();
                this.checkedValueSmns = [];
            }
        }
    }

    get pageOrgs(): number[] {
        var pageOrg: number[] = [];
        this.totalPageOrgs = Math.ceil(this.totalItemOrgs / this.pageSizeOrg);
        for (var i = -this.pagesToShowOrg; i <= this.pagesToShowOrg; i++) {
            if (this.currentPageOrg + i > 0 && this.currentPageOrg + i <= this.totalPageOrgs) {
                pageOrg.push(this.currentPageOrg + i);
            }
        }
        return pageOrg;
    }

    get pageElns(): number[] {
        var pageEln: number[] = [];
        this.totalPageElns = Math.ceil(this.totalItemElns / this.pageSizeEln);
        for (var i = -this.pagesToShowEln; i <= this.pagesToShowEln; i++) {
            if (this.currentPageEln + i > 0 && this.currentPageEln + i <= this.totalPageElns) {
                pageEln.push(this.currentPageEln + i);
            }
        }
        return pageEln;
    }

    get pageSmns(): number[] {
        var pageEln: number[] = [];
        this.totalPageSmns = Math.ceil(this.totalItemSmns / this.pageSizeSmn);
        for (var i = -this.pagesToShowSmn; i <= this.pagesToShowSmn; i++) {
            if (this.currentPageSmn + i > 0 && this.currentPageSmn + i <= this.totalPageSmns) {
                pageEln.push(this.currentPageSmn + i);
            }
        }
        return pageEln;
    }

    async getFormOrg(pageOrg: number, pageSizeOrg: number) {
        await this.contactService
            .getOrgByPage(pageOrg, pageSizeOrg, `${this.sortIdOrg},${this.sortOrderOrg}`, this.valueSearchOrg, this.selectedFilter)
            .subscribe((res: any) => {
                this.organizations = res;
                this.spareorganizations = res;
            });
    }

    async getPageOrg() {
        await this.contactService.countOrg(this.valueSearchOrg, this.userId).subscribe((res: any) => {
            this.totalItemOrgs = res.count;
        });
        console.log('Conut Org:', this.totalItemOrgs);
    }

    async getPageEln() {
        await this.callServive.countActivityById(this.valueSearchEln, this.userId).subscribe((res: any) => {
            this.totalItemElns = res.count;
        });
        console.log('Conut Ac:', this.totalItemElns);
    }

    searchOrg() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
    }

    searchEln(): void {
        this.callServive.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
        });
    }

    searchSmn(): void {
        this.callServive.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
        });
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

    async showSideBarActivitySeminar() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.searchContactShowing = false;
        this.SearchOrgShowing = false;
        this.SearchSmnShowing = true;
        this.thanks = false;
        this.AddContactShowing = false;
        this.showOrgSidebar = false;
        this.showContactSidebar = false;
        this.showActivitySeminarSideBar = true;
        this.showActivityElearningSideBar = false;
    }

    async showSideBarActivityElearning() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.SearchElearningShowing = true;
        this.thanks = false;
        this.AddContactShowing = false;
        this.showOrgSidebar = false;
        this.showContactSidebar = false;
        this.showActivitySeminarSideBar = false;
        this.showActivityElearningSideBar = true;
    }

    // async getActivityById() {
    //     try {
    //         const res = await this.callServive.getActivityById().toPromise();
    //         this.activityTypeById = res;
    //         console.log('activity: ', this.activityTypeById);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }

    async getFormEln() {
        await this.callServive.getActivityIdByPage(this.valueSearchEln).subscribe((res: any) => {
            console.log('API response:', res);
            this.activityTypeById = res;
            // this.spareActivityTypeById = res;
        });
        console.log('ActivityIdByPage:', this.activityTypeById);
    }

    async getFormContac(pageContact: number, pageSizeContact: number) {
        await this.callServive
            .getContactByPage(
                pageContact,
                pageSizeContact,
                `${this.sortIdContact},${this.sortOrderContact}`,
                this.valuesearchContact,
                this.selectedFilter,
            )
            .subscribe((res: any) => {
                console.log('API response:', res);
                this.contacts = res;
                this.sparecontacts = res;
                console.log('contact:', this.contacts);
            });
    }

    toggleActivityTopicId(activityTopicId: string) {
        const index = this.selectedActivityTopicId.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedActivityTopicId.push(activityTopicId);
        } else {
            this.selectedActivityTopicId.splice(index, 1);
        }
      console.log('select id activity:', this.selectedActivityTopicId);
      this.saveSelectedActivities()
    }

    toggleActivityTopicIdSmn(activityTopicId: string) {
        const index = this.selectedActivityTopicIdSmn.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedActivityTopicIdSmn.push(activityTopicId);
        } else {
            this.selectedActivityTopicIdSmn.splice(index, 1);
        }
        console.log('select id activity:', this.selectedActivityTopicIdSmn);
        this.saveSelectedActivitiesSmn();
    }

    selectedCheckboxIds: number[] = [];

    toggleCheckbox(activityTopicId: number) {
        const index = this.selectedCheckboxIds.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedCheckboxIds.push(activityTopicId);
        } else {
            this.selectedCheckboxIds.splice(index, 1);
        }
    }

    // อัปเดตรายการทั้งหมดสำหรับโครงการอบรม/สัมมนา
    updateSelectedActivitiesListSmn() {
        this.selectedActivitiesSmn = this.activityTypeById.filter((smn: { activityTopicId: string }) =>
            this.selectedActivityTopicIdSmn.includes(smn.activityTopicId),
        );
    }

    // อัปเดตรายการทั้งหมดสำหรับ E-Learning
    updateSelectedActivitiesListElearning() {
        this.selectedActivitiesElearning = this.activityEln.filter((elearning: { activityTopicId: string }) =>
            this.selectedActivityTopicId.includes(elearning.activityTopicId),
        );
    }
    saveSelectedActivities() {
        this.selectedActivities = this.activityEln.filter((activity: { activityTopicId: string }) => {
            return this.selectedActivityTopicId.includes(activity.activityTopicId);
        });
    }

    saveSelectedActivitiesSmn() {
        this.selectedActivitiesSmn = this.activitySmn.filter((activity: { activityTopicId: string }) => {
            return this.selectedActivityTopicIdSmn.includes(activity.activityTopicId);
        });
    }

    inputActivityElearning(event: any) {
        console.log(event.target.value);
    }

    filterActivities(): any[] {
        return this.activitiestype.filter((activityType: { activityTypeId: number }) => [21, 27, 28].includes(activityType.activityTypeId));
    }


}
