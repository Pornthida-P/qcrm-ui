import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CallService } from 'src/app/services/call/call.service';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, take, tap, throwError } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
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
    private readonly socialChannelIds: string[] = ['4', '5'];
    selectedDate: Date | undefined;
    contactId: string = '';
    caseTypes: any[] = [];
    caseTopicsList: any[] = [];
    caseSubjects: any[] = [];
    allCaseSubjects: any[] = [];
    organizations: any;
    contacts: any[] = [];
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
    selectedCaseType: any = null;
    selectedCaseTopic: any = null;
    selectedCaseSubject: any = null;
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

    // Autocomplete controls
    caseTypeControl = new FormControl('');
    caseTopicControl = new FormControl('');
    caseSubjectControl = new FormControl('');
    filteredCaseTypes: any[] = [];
    filteredCaseTopics: any[] = [];
    filteredCaseSubjects: any[] = [];

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
        private userService: UserService,
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

        this.callServive.getCaseType().subscribe((caseTypes: any) => {
            this.caseTypes = caseTypes;
            this.filteredCaseTypes = caseTypes;
        });

        this.callServive.getCaseTopics().subscribe((caseTopicsList: any) => {
            this.caseTopicsList = caseTopicsList;
            this.filteredCaseTopics = caseTopicsList;
        });

        this.callServive.getCaseSubjects().subscribe((caseSubjects: any) => {
            this.allCaseSubjects = Array.isArray(caseSubjects) ? caseSubjects : [];
            this.clearCaseSubjectSelection();
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
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        const selectedDate = this.startTime ? this.formatDate(new Date(this.startTime)) : this.formatDate(new Date());
        const selectedTime = this.timepickStart ? this.formatTime(this.timepickStart) : this.formatTime(new Date());

        if (this.selectedCaseTopic || this.isSocialChannelSelected) {
            this.userService
                .getDataUser()
                .pipe(take(1))
                .subscribe((currentUser) => {
                    let createdById = currentUser?.userId ?? '';
                    if (!createdById) {
                        this.userService.refreshFromStorage();
                        this.userService
                            .getDataUser()
                            .pipe(take(1))
                            .subscribe((userAgain) => {
                                createdById = userAgain?.userId ?? '';
                                if (!createdById) {
                                    this.sweetalertServices.error('alert.error');
                                    return;
                                }
                                this.submitCreateCase(createdById, selectedDate, selectedTime);
                            });
                        return;
                    }
                    this.submitCreateCase(createdById, selectedDate, selectedTime);
                });
        } else {
            this.sweetalertServices.error('alert.pleaseEnterCode');
        }
    }

    private async submitCreateCase(createdById: string, selectedDate: string, selectedTime: string): Promise<void> {
        this.syncCaseTopicSelectionFromControl();
        this.syncCaseSubjectSelectionFromControl();
        const caseTopicId = this.resolveCaseTopicId();
        const caseSubjectId = this.resolveCaseSubjectId();

        const requestDateTime = `${selectedDate} ${selectedTime}`;
        const now = new Date().toISOString();
        const dataForm = {
            caseId: this.callIdEdit || null,
            contactId: this.contactIdSelect,
            channelId: this.selectedChannels,
            requestDateTime,
            description: this.description,
            caseTypeId: this.selectedCaseType,
            caseTopicId,
            caseSubjectId,
            operationType: this.selectedCallTypeId,
            status: this.selectedStatus,
            solution: this.solutions,
            contactNumber: this.selectedContactNumber ? this.selectedContactNumber.contactNumberId : null,
            source: null,
            assignedAt: null,
            createdAt: now,
            createdById,
            modifiedAt: now,
            modifiedById: null,
            isDeleted: 0,
            assignedUserId: null,
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

    onChannelChange(_channelId: string) {
    }

    get isSocialChannelSelected(): boolean {
        return this.socialChannelIds.includes(this.selectedChannels);
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

    // Autocomplete filter functions
    filterCaseTypes() {
        const controlValue = this.caseTypeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredCaseTypes = [...this.caseTypes];
            return;
        }

        this.filteredCaseTypes = this.caseTypes.filter((type: any) => type.name.toLowerCase().includes(filterValue));
    }

    private hasAutocompleteSelection(value: any): boolean {
        return value != null && typeof value === 'object' && value.id != null;
    }

    private syncCaseTopicSelectionFromControl(): void {
        if (!this.hasAutocompleteSelection(this.caseTopicControl.value) && this.selectedCaseTopic != null) {
            this.selectedCaseTopic = null;
            this.clearCaseSubjectSelection();
        }
    }

    private syncCaseSubjectSelectionFromControl(): void {
        if (!this.hasAutocompleteSelection(this.caseSubjectControl.value) && this.selectedCaseSubject != null) {
            this.selectedCaseSubject = null;
        }
    }

    private resolveAutocompleteId(value: any): any {
        return this.hasAutocompleteSelection(value) ? value.id : null;
    }

    private resolveCaseTopicId(): any {
        return this.resolveAutocompleteId(this.caseTopicControl.value);
    }

    private resolveCaseSubjectId(): any {
        return this.resolveAutocompleteId(this.caseSubjectControl.value);
    }

    filterCaseTopics() {
        this.syncCaseTopicSelectionFromControl();
        const controlValue = this.caseTopicControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredCaseTopics = [...this.caseTopicsList];
            return;
        }

        this.filteredCaseTopics = this.caseTopicsList.filter((group: any) => group.name.toLowerCase().includes(filterValue));
    }

    filterCaseSubjects() {
        this.syncCaseTopicSelectionFromControl();
        this.syncCaseSubjectSelectionFromControl();

        if (!this.selectedCaseTopic) {
            this.filteredCaseSubjects = [];
            return;
        }

        const controlValue = this.caseSubjectControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredCaseSubjects = [...this.caseSubjects];
            return;
        }

        this.filteredCaseSubjects = this.caseSubjects.filter((type: any) => type.name.toLowerCase().includes(filterValue));
    }

    clearCaseSubjectSelection(): void {
        this.caseSubjects = [];
        this.filteredCaseSubjects = [];
        this.selectedCaseSubject = null;
        this.caseSubjectControl.setValue('');
        this.caseSubjectControl.disable();
    }

    loadCaseSubjectsForSelectedTopic(clearSubject = true, subjectIdToSelect?: any): void {
        if (!this.selectedCaseTopic) {
            this.clearCaseSubjectSelection();
            return;
        }

        this.callServive.getCaseSubjects(this.selectedCaseTopic).subscribe({
            next: (response: any) => {
                const subjects = Array.isArray(response) ? response : [];
                this.caseSubjects = subjects;
                this.filteredCaseSubjects = [...subjects];

                if (clearSubject) {
                    this.selectedCaseSubject = null;
                    this.caseSubjectControl.setValue('');
                }

                this.caseSubjectControl.enable();

                if (subjectIdToSelect) {
                    this.applyCaseSubjectSelection(subjectIdToSelect);
                } else if (!clearSubject && this.selectedCaseSubject) {
                    this.applyCaseSubjectSelection(this.selectedCaseSubject);
                }
            },
            error: () => {
                this.clearCaseSubjectSelection();
            },
        });
    }

    applyCaseSubjectSelection(subjectId: any): void {
        if (!subjectId) {
            return;
        }

        let selected = this.caseSubjects.find((subject: any) => subject.id == subjectId);
        if (!selected) {
            selected = this.allCaseSubjects.find((subject: any) => subject.id == subjectId);
            if (selected) {
                this.caseSubjects = [selected, ...this.caseSubjects];
                this.filteredCaseSubjects = [...this.caseSubjects];
            }
        }

        if (selected) {
            this.selectedCaseSubject = selected.id;
            this.caseSubjectControl.setValue(selected);
            this.caseSubjectControl.enable();
        }
    }

    onCaseTopicChanged(): void {
        this.loadCaseSubjectsForSelectedTopic(true);
    }

    displayCaseTypeFn(caseType: any): string {
        return caseType && caseType.name ? caseType.name : '';
    }

    displayCaseTopicFn(caseTopic: any): string {
        return caseTopic && caseTopic.name ? caseTopic.name : '';
    }

    displayCaseSubjectFn(caseSubject: any): string {
        return caseSubject && caseSubject.name ? caseSubject.name : '';
    }

    onCaseTypeSelected(event: any) {
        const selectedCaseType = event.option.value;
        this.selectedCaseType = selectedCaseType.id;
    }

    onCaseTopicSelected(event: any) {
        const selectedCaseTopic = event.option.value;
        this.selectedCaseTopic = selectedCaseTopic.id;
        this.onCaseTopicChanged();
    }

    onCaseSubjectSelected(event: any) {
        const selectedCaseSubject = event.option.value;

        if (!this.selectedCaseTopic) {
            this.sweetalertServices.error('alert.pleaseSelectServiceGroup');
            return;
        }

        this.selectedCaseSubject = selectedCaseSubject.id;
    }

    getStatusList() {
        this.callListService.getStatusList().subscribe((res: any) => {
            this.statusList = res;
        });
    }
}
