import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CallService } from 'src/app/services/call/call.service';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, tap, throwError } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { NgSelectConfig } from '@ng-select/ng-select';
import * as moment from 'moment';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { Attachment } from 'src/app/shared/interface/attachment.interface';
import Swal from 'sweetalert2';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { TranslateService } from '@ngx-translate/core';
import { config } from 'src/app/config/config';
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
    comment: string = '';
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
    selectedCasesubject: any;
    selectedCaseTopics: string | null = null;
    selectedChannels: any;
    selectedStatus: any;

    parent: any = null;

    model: any;
    organizationName: string | undefined;

    myForm: FormGroup | any;
    channels: any;

    searchContactShowing: boolean = false;
    showContactSidebar: boolean = false;

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

    sortIdContact: string = 'createdAt';
    sortOrderContact: string = 'DESC';

    valueSearch!: string;

    valuesearchContact!: string;
    selectedFilter: any | undefined;
    spareorganizations!: any;

    sortIcon: string = '';

    checkedValueContact: string[] = [];

    faCircleXmark = faCircleXmark;
    sparecontacts: any;

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userId: any;
    activitiestype: any;
    contactIdSelect: string = '';
    activityTypeId: any;
    newDateTime: any;
    selectedOrganizationId: string | null = null;

    files: File[] = [];
    fileNames: any;
    attachments: Attachment[] = [];
    attachmentsId: string[] | undefined;
    callTypes: any;
    selectedCallTypeId: string = '';

    inbound: string = config.operationType.inbound;
    outbound: string = config.operationType.outbound;
    operationType: any;

    isCheckboxSelected: { [key: number]: boolean } = {};

    activityId: string = '';
    activityTypeById: any;
    activitiesTopic: any;

    selectedOrganizations: string[] = [];
    selectedActivityTopicId: string[] = [];
    callIdEdit: any;
    callId: any;
    callFideId: any;
    contactNumber: any;
    contactNumbers: any;
    selectedContactNumber: { contactNumber: string; contactNumberId: string } | null = null;
    statusList: any[] = [];
    selectedCaseTopicObject: any = null;

    // Autocomplete controls
    topicControl = new FormControl('');
    subjectControl = new FormControl('');
    filteredTopics: any[] = [];
    filteredSubjects: any[] = [];

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
        private callListService: CallListService,
        private translate: TranslateService,
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
        this.subjectControl.disable();
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
            this.filteredTopics = casetopics;
        });

        this.callServive.getAllCaseSubjects().subscribe((casesubjects: any) => {
            this.casesubjects = casesubjects;
        });

        this.callServive.getAllChannels().subscribe((channels: any) => {
            this.channels = channels;
        });

        this.myForm = new FormGroup({
            contactId: new FormControl(''),
        });

        this.selectedFilter = 'all';

        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        }

        this.getFormContact((this.currentPageContact - 1) * this.pageSizeContact, this.pageSizeContact);
        this.getPageContact();

        const now = new Date();
        this.timepickStart = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };

        this.callTypes = [
            { id: '1', name: this.inbound },
            { id: '2', name: this.outbound },
        ];

        this.getStatusList();
    }

    submit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        const selectedDate = this.startTime ? this.formatDate(new Date(this.startTime)) : this.formatDate(new Date());
        const selectedTime = this.timepickStart ? this.formatTime(this.timepickStart) : this.formatTime(new Date());

        const isChannelOne = this.selectedChannels === '1' || this.selectedChannels === '2' || this.selectedChannels === '3';

        const selectedCallTypeId = isChannelOne ? this.selectedCallTypeId : null;

        if (this.selectedCaseTopics) {
            const caseTopicId = this.selectedCaseTopics;

            const caseTopicCode =
                caseTopicId && this.casetopics
                    ? this.casetopics.find((topic: any) => topic.caseTopicId === caseTopicId)?.code || null
                    : null;

            const caseSubjectId = this.selectedCasesubject || null;

            // Format requestDateTime
            const requestDateTime = `${selectedDate} ${selectedTime}`;

            // Get current timestamp for createdAt and modifiedAt
            const now = new Date().toISOString();

            const dataForm = {
                caseId: this.callIdEdit || null,
                contactId: this.contactIdSelect,
                channelId: this.selectedChannels,
                requestDateTime: requestDateTime,
                description: this.description,
                caseTopicId: caseTopicId,
                caseTopicCode: caseTopicCode,
                caseSubjectId: caseSubjectId,
                operationType: selectedCallTypeId,
                priority: null, // Add if you have priority field in form
                status: this.selectedStatus,
                solution: this.solutions,
                contactNumber: this.selectedContactNumber ? this.selectedContactNumber.contactNumberId : null,
                source: null, // Add if you have source field in form
                assignedAt: null, // Add if you have assignedAt field in form
                createdAt: now,
                createdById: userData.userId,
                modifiedAt: now,
                modifiedById: null,
                isDeleted: 0,
                assignedUserId: null, // Add if you have assignedUserId field in form
                attachment: this.attachmentsId,
                comment: this.comment,
            };

            this.callServive
                .createCase(dataForm)
                .pipe(
                    tap((res) => {
                        this.sweetalertServices.success('alert.saveSuccess', '/contacts');
                        this.auditLogService.log(
                            '',
                            'Create Call',
                            dataForm.caseId || '',
                            'Create Case Call',
                            `Detail Create call : ContactID : ${dataForm.contactId}
                      ,RequestDateTime : ${dataForm.requestDateTime}
                      ,ChannelId : ${dataForm.channelId}
                      ,Type : ${dataForm.operationType}`,
                            `Success`,
                        );
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Create Call',
                            dataForm.caseId || '',
                            'Create Case Call',
                            `Detail Create call : ContactID : ${dataForm.contactId}
                      ,RequestDateTime : ${dataForm.requestDateTime}
                      ,ChannelId : ${dataForm.channelId}
                      ,Type : ${dataForm.operationType}`,
                            `Failed, Error : ${error}`,
                        );
                        throw error;
                    }),
                )
                .subscribe();
        }
    }

    showSideBarContact() {
        this.searchContactShowing = true;
        this.showContactSidebar = true;
    }

    hideSideBarContact() {
        this.searchContactShowing = false;
        this.showContactSidebar = false;
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
                this.contacts = res;
                this.sparecontacts = res;
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
        this.getContactNumber(contactsId);
        this.hideSideBarContact();
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

    async getContactNumber(contactsId: string) {
        try {
            const contactNumber = (await this.callServive.getContactNumbertById(contactsId).toPromise()) as any[];

            if (contactNumber && contactNumber.length > 0) {
                this.contactNumber = contactNumber;
            } else {
                console.warn('No contact number found for this contactId');
            }
        } catch (error) {
            console.error('Error fetching contact number', error);
        }
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
                this.contacts = res;
                this.sparecontacts = res;
            });
    }

    selectedCheckboxIds: number[] = [];

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
        this.filteredTopics = this.casetopics.filter(
            (topic) => topic.name.toLowerCase().includes(filterValue) || topic.code.toLowerCase().includes(filterValue),
        );
    }

    filterSubjects() {
        const filterValue = (this.subjectControl.value || '').toString().toLowerCase();
        this.filteredSubjects = this.casesubjects.filter(
            (subject) => subject.caseTopicId == this.selectedCaseTopics && subject.name.toLowerCase().includes(filterValue),
        );
    }

    displayTopicFn(topic: any): string {
        return topic && topic.name ? `${topic.code} - ${topic.name}` : '';
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

    getStatusList() {
        this.callListService.getStatusList().subscribe((res: any) => {
            this.statusList = res;
        });
    }

    get hasSubjectsForSelectedTopic(): boolean {
        if (!this.selectedCaseTopics) return false;
        return this.casesubjects.some((subject) => subject.caseTopicId == this.selectedCaseTopics);
    }
}
