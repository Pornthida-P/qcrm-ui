import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CallService } from 'src/app/services/call/call.service';
import { CaseServiceHierarchyService } from 'src/app/services/case-service-hierarchy/case-service-hierarchy.service';
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
    caseCodes: any[] = [];
    caseTypes: any[] = [];
    serviceGroups: any[] = [];
    serviceTypes: any[] = [];
    allServiceTypes: any[] = [];
    serviceSubTypes: any[] = [];
    allServiceSubTypes: any[] = [];
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
    selectedCaseCode: any = null;
    selectedCaseCodeObject: any = null;
    selectedCaseType: any = null;
    selectedServiceGroup: any = null;
    selectedServiceType: any = null;
    selectedServiceSubType: any = null;
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
    casePriorities: any[] = [];
    selectedCasePriority: any = null;

    inspectionCompany: any;
    selectedInspectionCompany: any = '';
    selectedInspectionCompanies: any;
    inspectionCompanyDate: Date | null = null;
    inspectionCompanyTime: { hour: number; minute: number; second: number } = { hour: 0, minute: 0, second: 0 };
    inspectionCompanyReplyDate: Date | null = null;
    inspectionCompanyReplyTime: { hour: number; minute: number; second: number } = { hour: 0, minute: 0, second: 0 };
    selectedInspectionCompanyTtb: any = '';
    inspectionCompanyReplyDateTtb: Date | null = null;
    inspectionCompanyReplyTimeTtb: { hour: number; minute: number; second: number } = { hour: 0, minute: 0, second: 0 };
    inspectionCompanySendReply: any;

    // Autocomplete controls
    codeControl = new FormControl('');
    caseTypeControl = new FormControl('');
    serviceGroupControl = new FormControl('');
    serviceTypeControl = new FormControl('');
    serviceSubTypeControl = new FormControl('');
    caseGroupControl = new FormControl('');
    filteredCodes: any[] = [];
    filteredCaseTypes: any[] = [];
    filteredServiceGroups: any[] = [];
    filteredServiceTypes: any[] = [];
    filteredServiceSubTypes: any[] = [];
    filteredCaseGroups: any[] = [];
    caseGroupReport: any;
    selectedCaseGroup: any = null;

    // pageEln: number | undefined = 0;

    // selectedActivityTopicId: string[] = [];

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private callServive: CallService,
        private caseServiceHierarchyService: CaseServiceHierarchyService,
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

    formatInspectionDateTime(date: Date | null, time: { hour: number; minute: number; second: number } | null | undefined): string | null {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            return null;
        }
        const dateStr = this.formatDate(date);
        const timeStr = time ? this.formatTime(time) : '00:00:00';
        return `${dateStr} ${timeStr}`;
    }

    getSelectedInspectionCompaniesWithGroup(): { inspectionCompanyId: string | number; group: string | number }[] {
        const ids = Array.isArray(this.selectedInspectionCompanies) ? this.selectedInspectionCompanies : [];
        const list = this.inspectionCompany && Array.isArray(this.inspectionCompany) ? this.inspectionCompany : [];
        return ids.map((id: string | number) => {
            const c = list.find(
                (x: any) => x.id === id || x.companyId === id || x.inspectionCompanyId === id || String(x.id) === String(id),
            );
            const group = c?.gruop ?? c?.group ?? c?.groupId ?? null;
            return { inspectionCompanyId: id, group: group != null ? group : '' };
        });
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
            this.allServiceTypes = Array.isArray(serviceTypes) ? serviceTypes : [];
            this.clearServiceTypeSelection();
        });

        this.callServive.getServiceSubType().subscribe((serviceSubTypes: any) => {
            this.allServiceSubTypes = Array.isArray(serviceSubTypes) ? serviceSubTypes : [];
            this.clearServiceSubTypeSelection();
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
        this.getCasePriority();
        this.getInspectionCompany();
        this.getCaseGroupReport();
    }

    submit() {
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        const selectedDate = this.startTime ? this.formatDate(new Date(this.startTime)) : this.formatDate(new Date());
        const selectedTime = this.timepickStart ? this.formatTime(this.timepickStart) : this.formatTime(new Date());

        if (this.selectedCaseCode || this.isSocialChannelSelected) {
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
        this.syncServiceGroupSelectionFromControl();
        this.syncServiceTypeSelectionFromControl();
        this.syncServiceSubTypeSelectionFromControl();
        const caseServiceGroupId = this.resolveCaseServiceGroupId();
        const caseServiceTypeId = this.resolveCaseServiceTypeId();
        const caseServiceSubTypeId = this.resolveCaseServiceSubTypeId();
        const caseGroupReportId = this.resolveCaseGroupReportId();
        await this.caseServiceHierarchyService.warnOnSaveIfNeeded(
            caseServiceGroupId,
            caseServiceTypeId,
            caseServiceSubTypeId,
            this.allServiceTypes,
        );

        const requestDateTime = `${selectedDate} ${selectedTime}`;
        const now = new Date().toISOString();
        const dataForm = {
            caseId: this.callIdEdit || null,
            contactId: this.contactIdSelect,
            channelId: this.selectedChannels,
            requestDateTime,
            description: this.description,
            caseCodeId: this.selectedCaseCode,
            caseTypeId: this.selectedCaseType,
            caseServiceGroupId,
            caseServiceTypeId,
            caseServiceSubTypeId,
            caseGroupReportId,
            operationType: this.selectedCallTypeId,
            priority: null,
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
            casePriority: this.selectedCasePriority || null,
            selectedInspectionCompanies: this.getSelectedInspectionCompaniesWithGroup(),
            inspectionCompanyDateTime: this.formatInspectionDateTime(this.inspectionCompanyDate, this.inspectionCompanyTime),
            selectedInspectionCompany: this.selectedInspectionCompany || null,
            inspectionCompanyReplyGroup: 1,
            inspectionCompanyReplyDateTime: this.formatInspectionDateTime(this.inspectionCompanyReplyDate, this.inspectionCompanyReplyTime),
            selectedInspectionCompanyTtb: this.selectedInspectionCompanyTtb || null,
            inspectionCompanyReplyTtbGroup: 2,
            inspectionCompanyReplyDateTimeTtb: this.formatInspectionDateTime(
                this.inspectionCompanyReplyDateTtb,
                this.inspectionCompanyReplyTimeTtb,
            ),
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

    isPendingStatus(): boolean {
        return this.selectedStatus == 2;
    }

    getInspectionCompany() {
        this.callListService.getInspectionCompany().subscribe((res: any) => {
            this.inspectionCompany = res;
        });
    }

    get inspectionCompanyGroup1(): any[] {
        if (!this.inspectionCompany || !Array.isArray(this.inspectionCompany)) {
            return [];
        }
        return this.inspectionCompany.filter(
            (c: any) =>
                c.gruop === 1 ||
                c.gruop === '1' ||
                c.group === 1 ||
                c.groupId === 1 ||
                c.inspectionCompanyGroup === 1 ||
                String(c.group) === '1' ||
                String(c.groupId) === '1',
        );
    }

    get inspectionCompanyGroup2(): any[] {
        if (!this.inspectionCompany || !Array.isArray(this.inspectionCompany)) {
            return [];
        }
        return this.inspectionCompany.filter(
            (c: any) =>
                c.gruop === 2 ||
                c.gruop === '2' ||
                c.group === 2 ||
                c.groupId === 2 ||
                c.inspectionCompanyGroup === 2 ||
                String(c.group) === '2' ||
                String(c.groupId) === '2',
        );
    }

    get inspectionCompanySendNames(): string {
        const send = this.inspectionCompanySendReply?.send;
        if (!Array.isArray(send) || send.length === 0) return '';
        return send
            .map((s: any) => s.inspectionCompanyName || s.inspectionCompanyId || '')
            .filter(Boolean)
            .join(', ');
    }

    get inspectionCompanyReplyNamesGroup1(): string {
        const reply = this.inspectionCompanySendReply?.reply;
        if (!Array.isArray(reply)) return '';
        const group1 = reply.filter((r: any) => String(r.group) === '1' || r.group === 1);
        return group1
            .map((r: any) => r.inspectionCompanyName || r.inspectionCompanyId || '')
            .filter(Boolean)
            .join(', ');
    }

    get inspectionCompanyReplyNamesGroup2(): string {
        const reply = this.inspectionCompanySendReply?.reply;
        if (!Array.isArray(reply)) return '';
        const group2 = reply.filter((r: any) => String(r.group) === '2' || r.group === 2);
        return group2
            .map((r: any) => r.inspectionCompanyName || r.inspectionCompanyId || '')
            .filter(Boolean)
            .join(', ');
    }

    getCasePriority(caseId?: string) {
        this.callListService.getCasePriority(caseId || '').subscribe((res: any) => {
            const parsed = typeof res === 'string' ? JSON.parse(res) : res;
            this.casePriorities = Array.isArray(parsed) ? parsed : [];
        });
    }

    onChannelChange(channelId: string) {
        if (this.socialChannelIds.includes(channelId)) {
            this.selectedCaseCode = null;
            this.selectedCaseCodeObject = null;
            this.codeControl.setValue('');
        }
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
    filterCodes() {
        const controlValue = this.codeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.code : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredCodes = [...this.caseCodes];
            return;
        }

        this.filteredCodes = this.caseCodes.filter((code: any) => code.code.toLowerCase().includes(filterValue));

        const exactMatch = this.caseCodes.find((code: any) => code.code.toLowerCase() === filterValue);
        if (!exactMatch && filterValue) {
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

    private hasAutocompleteSelection(value: any): boolean {
        return value != null && typeof value === 'object' && value.id != null;
    }

    private syncServiceGroupSelectionFromControl(): void {
        if (!this.hasAutocompleteSelection(this.serviceGroupControl.value) && this.selectedServiceGroup != null) {
            this.selectedServiceGroup = null;
            this.clearServiceTypeSelection();
        }
    }

    private syncServiceTypeSelectionFromControl(): void {
        if (!this.hasAutocompleteSelection(this.serviceTypeControl.value)) {
            if (this.selectedServiceType != null || this.selectedServiceSubType != null) {
                this.selectedServiceType = null;
                this.selectedServiceSubType = null;
                this.serviceSubTypes = [];
                this.filteredServiceSubTypes = [];
                this.serviceSubTypeControl.setValue('');
                this.serviceSubTypeControl.disable();
            }
        }
    }

    private syncServiceSubTypeSelectionFromControl(): void {
        if (!this.hasAutocompleteSelection(this.serviceSubTypeControl.value)) {
            this.selectedServiceSubType = null;
        }
    }

    private resolveAutocompleteId(value: any): any {
        return this.hasAutocompleteSelection(value) ? value.id : null;
    }

    private resolveCaseServiceGroupId(): any {
        return this.resolveAutocompleteId(this.serviceGroupControl.value);
    }

    private resolveCaseServiceTypeId(): any {
        return this.resolveAutocompleteId(this.serviceTypeControl.value);
    }

    private resolveCaseServiceSubTypeId(): any {
        return this.resolveAutocompleteId(this.serviceSubTypeControl.value);
    }

    private resolveCaseGroupReportId(): any {
        return this.resolveAutocompleteId(this.caseGroupControl.value);
    }

    filterCaseGroups() {
        const controlValue = this.caseGroupControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        const list = Array.isArray(this.caseGroupReport) ? this.caseGroupReport : [];

        if (!filterValue) {
            this.filteredCaseGroups = [...list];
            return;
        }

        this.filteredCaseGroups = list.filter((group: any) => (group.name || '').toLowerCase().includes(filterValue));
    }

    filterServiceGroups() {
        this.syncServiceGroupSelectionFromControl();
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
        this.syncServiceGroupSelectionFromControl();
        this.syncServiceTypeSelectionFromControl();

        if (!this.selectedServiceGroup) {
            this.filteredServiceTypes = [];
            return;
        }

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

    clearServiceTypeSelection(): void {
        this.serviceTypes = [];
        this.filteredServiceTypes = [];
        this.selectedServiceType = null;
        this.serviceTypeControl.setValue('');
        this.serviceTypeControl.disable();
        this.clearServiceSubTypeSelection();
    }

    loadServiceTypesForSelectedGroup(clearType = true, typeIdToSelect?: any, subTypeIdToSelect?: any): void {
        if (!this.selectedServiceGroup) {
            this.clearServiceTypeSelection();
            return;
        }

        this.callServive.getCaseServiceTypeByGroupId(this.selectedServiceGroup).subscribe({
            next: (response: any) => {
                const types = Array.isArray(response) ? response : [];
                this.serviceTypes = types;
                this.filteredServiceTypes = [...types];

                if (clearType) {
                    this.selectedServiceType = null;
                    this.serviceTypeControl.setValue('');
                    this.clearServiceSubTypeSelection();
                }

                this.serviceTypeControl.enable();

                if (typeIdToSelect) {
                    this.applyServiceTypeSelection(typeIdToSelect, subTypeIdToSelect);
                } else if (!clearType && this.selectedServiceType) {
                    this.applyServiceTypeSelection(this.selectedServiceType, subTypeIdToSelect);
                }
            },
            error: () => {
                this.clearServiceTypeSelection();
            },
        });
    }

    applyServiceTypeSelection(typeId: any, subTypeIdToSelect?: any): void {
        if (!typeId) {
            return;
        }

        let selected = this.serviceTypes.find((type: any) => type.id == typeId);
        if (!selected) {
            selected = this.allServiceTypes.find((type: any) => type.id == typeId);
            if (selected) {
                this.serviceTypes = [selected, ...this.serviceTypes];
                this.filteredServiceTypes = [...this.serviceTypes];
            }
        }

        if (selected) {
            this.selectedServiceType = selected.id;
            this.serviceTypeControl.setValue(selected);
            this.serviceTypeControl.enable();
            if (subTypeIdToSelect || this.selectedServiceSubType) {
                this.loadServiceSubTypesForSelectedType(false, subTypeIdToSelect ?? this.selectedServiceSubType);
            }
        }
    }

    onServiceGroupChanged(): void {
        this.loadServiceTypesForSelectedGroup(true);
    }

    filterServiceSubTypes() {
        this.syncServiceTypeSelectionFromControl();
        this.syncServiceSubTypeSelectionFromControl();

        if (!this.selectedServiceType) {
            this.filteredServiceSubTypes = [];
            this.serviceSubTypeControl.disable();
            return;
        }

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

    clearServiceSubTypeSelection(): void {
        this.serviceSubTypes = [];
        this.filteredServiceSubTypes = [];
        this.selectedServiceSubType = null;
        this.serviceSubTypeControl.setValue('');
        this.serviceSubTypeControl.disable();
    }

    loadServiceSubTypesForSelectedType(clearSubType = true, subTypeIdToSelect?: any): void {
        if (!this.selectedServiceType) {
            this.clearServiceSubTypeSelection();
            return;
        }

        this.callServive.getServiceSubTypeByTypeId(this.selectedServiceType).subscribe({
            next: (response: any) => {
                const subTypes = Array.isArray(response) ? response : [];
                this.serviceSubTypes = subTypes;
                this.filteredServiceSubTypes = [...subTypes];

                if (clearSubType) {
                    this.selectedServiceSubType = null;
                    this.serviceSubTypeControl.setValue('');
                }

                this.serviceSubTypeControl.enable();

                if (subTypeIdToSelect) {
                    this.applySubTypeSelection(subTypeIdToSelect);
                } else if (!clearSubType && this.selectedServiceSubType) {
                    this.applySubTypeSelection(this.selectedServiceSubType);
                }
            },
            error: () => {
                this.clearServiceSubTypeSelection();
            },
        });
    }

    applySubTypeSelection(subTypeId: any): void {
        if (!subTypeId) {
            return;
        }

        let selected = this.serviceSubTypes.find((subType: any) => subType.id == subTypeId);
        if (!selected) {
            selected = this.allServiceSubTypes.find((subType: any) => subType.id == subTypeId);
            if (selected) {
                this.serviceSubTypes = [selected, ...this.serviceSubTypes];
                this.filteredServiceSubTypes = [...this.serviceSubTypes];
            }
        }

        if (selected) {
            this.selectedServiceSubType = selected.id;
            this.serviceSubTypeControl.setValue(selected);
            this.serviceSubTypeControl.enable();
        }
    }

    ensureSubTypeLinkedToType(subTypeId: any, createdById: string): void {
        if (!this.selectedServiceType || !subTypeId) {
            return;
        }

        this.callServive
            .createCaseServiceTypeSubType({
                caseServiceTypeId: this.selectedServiceType,
                caseServiceSubTypeId: subTypeId,
                createdById,
            })
            .subscribe({ error: () => {} });
    }

    onServiceTypeChanged(): void {
        this.loadServiceSubTypesForSelectedType(true);
    }

    displayCodeFn(code: any): string {
        return code && code.code ? code.code : '';
    }

    displayCaseTypeFn(caseType: any): string {
        return caseType && caseType.name ? caseType.name : '';
    }

    displayServiceGroupFn(serviceGroup: any): string {
        return serviceGroup && serviceGroup.name ? serviceGroup.name : '';
    }

    displayCaseGroupFn(group: any): string {
        return group && group.name ? group.name : '';
    }

    displayServiceTypeFn(serviceType: any): string {
        return serviceType && serviceType.name ? serviceType.name : '';
    }

    displayServiceSubTypeFn(serviceSubType: any): string {
        return serviceSubType && serviceSubType.name ? serviceSubType.name : '';
    }

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

            // สร้าง code ใหม่ (ใช้ user จาก UserService เพื่อรองรับ cross-auth จาก QIM)
            this.userService
                .getDataUser()
                .pipe(take(1))
                .subscribe((currentUser) => {
                    const createdById = currentUser?.userId ?? '';
                    this.callServive.createCaseCode({ code: selectedCode.code, script: '', createdById }).subscribe({
                        next: (res: any) => {
                            const newCode = typeof res === 'string' ? JSON.parse(res) : res;
                            this.selectedCaseCode = newCode.id;
                            this.selectedCaseCodeObject = newCode;
                            this.codeControl.setValue(newCode);
                            this.caseCodes.push(newCode);
                            this.filteredCodes = [...this.caseCodes];
                            this.sweetalertServices.success('alert.createSuccess');
                        },
                        error: (err) => {
                            this.sweetalertServices.handleError(err);
                        },
                    });
                });
        } else {
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

            // Create new caseType (ใช้ user จาก UserService เพื่อรองรับ cross-auth จาก QIM)
            this.userService
                .getDataUser()
                .pipe(take(1))
                .subscribe((currentUser) => {
                    const createdById = currentUser?.userId ?? '';
                    this.callServive.createCaseType({ name: selectedCaseType.name, createdById }).subscribe({
                        next: (res: any) => {
                            const newType = typeof res === 'string' ? JSON.parse(res) : res;
                            this.selectedCaseType = newType.id;
                            this.caseTypeControl.setValue(newType);
                            this.caseTypes.push(newType);
                            this.filteredCaseTypes = [...this.caseTypes];
                            this.sweetalertServices.success('alert.createSuccess');
                        },
                        error: (err) => {
                            this.sweetalertServices.handleError(err);
                        },
                    });
                });
        } else {
            this.selectedCaseType = selectedCaseType.id;
        }
    }

    onCaseGroupSelected(event: any) {
        const group = event.option.value;
        this.selectedCaseGroup = group?.id ?? null;
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
                this.onServiceGroupChanged();
                return;
            }

            // Create new serviceGroup (ใช้ user จาก UserService เพื่อรองรับ cross-auth จาก QIM)
            this.userService
                .getDataUser()
                .pipe(take(1))
                .subscribe((currentUser) => {
                    const createdById = currentUser?.userId ?? '';
                    this.callServive.createCaseServiceGroup({ name: selectedServiceGroup.name, createdById }).subscribe({
                        next: (res: any) => {
                            const newGroup = typeof res === 'string' ? JSON.parse(res) : res;
                            this.selectedServiceGroup = newGroup.id;
                            this.serviceGroupControl.setValue(newGroup);
                            this.serviceGroups.push(newGroup);
                            this.filteredServiceGroups = [...this.serviceGroups];
                            this.onServiceGroupChanged();
                            this.sweetalertServices.success('alert.createSuccess');
                        },
                        error: (err) => {
                            this.sweetalertServices.handleError(err);
                        },
                    });
                });
        } else {
            this.selectedServiceGroup = selectedServiceGroup.id;
            this.onServiceGroupChanged();
        }
    }

    onServiceTypeSelected(event: any) {
        const selectedServiceType = event.option.value;

        if (!this.selectedServiceGroup) {
            this.sweetalertServices.error('alert.pleaseSelectServiceGroup');
            return;
        }

        if (selectedServiceType.isNew) {
            // ตรวจสอบว่ามีชื่อซ้ำหรือไม่ (case-insensitive)
            const existingServiceType = this.serviceTypes.find((t: any) => t.name.toLowerCase() === selectedServiceType.name.toLowerCase());

            if (existingServiceType) {
                this.selectedServiceType = existingServiceType.id;
                this.serviceTypeControl.setValue(existingServiceType);
                this.filteredServiceTypes = [...this.serviceTypes];
                this.onServiceTypeChanged();
                return;
            }

            // Create new serviceType (ใช้ user จาก UserService เพื่อรองรับ cross-auth จาก QIM)
            this.userService
                .getDataUser()
                .pipe(take(1))
                .subscribe((currentUser) => {
                    const createdById = currentUser?.userId ?? '';
                    this.callServive
                        .createCaseServiceType({
                            name: selectedServiceType.name,
                            caseServiceGroupId: this.selectedServiceGroup,
                            createdById,
                        })
                        .subscribe({
                            next: (res: any) => {
                                const newType = typeof res === 'string' ? JSON.parse(res) : res;
                                this.selectedServiceType = newType.id;
                                this.serviceTypeControl.setValue(newType);
                                this.serviceTypes.push(newType);
                                this.allServiceTypes.push(newType);
                                this.filteredServiceTypes = [...this.serviceTypes];
                                this.onServiceTypeChanged();
                                this.sweetalertServices.success('alert.createSuccess');
                            },
                            error: (err) => {
                                this.sweetalertServices.handleError(err);
                            },
                        });
                });
        } else {
            this.selectedServiceType = selectedServiceType.id;
            this.onServiceTypeChanged();
        }
    }

    onServiceSubTypeSelected(event: any) {
        const selectedServiceSubType = event.option.value;

        if (!this.selectedServiceType) {
            this.sweetalertServices.error('alert.pleaseSelectServiceType');
            return;
        }

        if (selectedServiceSubType.isNew) {
            this.userService
                .getDataUser()
                .pipe(take(1))
                .subscribe((currentUser) => {
                    const createdById = currentUser?.userId ?? '';
                    const existingServiceSubType = this.allServiceSubTypes.find(
                        (st: any) => st.name.toLowerCase() === selectedServiceSubType.name.toLowerCase(),
                    );

                    if (existingServiceSubType) {
                        if (!this.serviceSubTypes.find((st: any) => st.id == existingServiceSubType.id)) {
                            this.serviceSubTypes = [existingServiceSubType, ...this.serviceSubTypes];
                        }
                        this.selectedServiceSubType = existingServiceSubType.id;
                        this.serviceSubTypeControl.setValue(existingServiceSubType);
                        this.filteredServiceSubTypes = [...this.serviceSubTypes];
                        this.ensureSubTypeLinkedToType(existingServiceSubType.id, createdById);
                        return;
                    }

                    this.callServive
                        .createServiceSubType({
                            name: selectedServiceSubType.name,
                            caseServiceTypeId: this.selectedServiceType,
                            createdById,
                        })
                        .subscribe({
                            next: (res: any) => {
                                const newSubType = typeof res === 'string' ? JSON.parse(res) : res;
                                this.selectedServiceSubType = newSubType.id;
                                this.serviceSubTypeControl.setValue(newSubType);
                                this.serviceSubTypes.push(newSubType);
                                this.allServiceSubTypes.push(newSubType);
                                this.filteredServiceSubTypes = [...this.serviceSubTypes];
                                this.sweetalertServices.success('alert.createSuccess');
                            },
                            error: (err) => {
                                this.sweetalertServices.handleError(err);
                            },
                        });
                });
        } else {
            this.selectedServiceSubType = selectedServiceSubType.id;
        }
    }

    getStatusList() {
        this.callListService.getStatusList().subscribe((res: any) => {
            this.statusList = res;
        });
    }

    getCaseGroupReport() {
        this.callListService.getCaseGroupReport().subscribe((res: any) => {
            this.caseGroupReport = Array.isArray(res) ? res : [];
            this.filteredCaseGroups = [...this.caseGroupReport];
        });
    }
}
