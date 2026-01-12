import { Component, Pipe, PipeTransform, OnInit } from '@angular/core';
import { faPenToSquare, faTrashCan, faArrowRight, faArrowLeft, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Call } from 'src/app/shared/interface/call';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import Swal from 'sweetalert2';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { catchError, tap } from 'rxjs';
import * as XLSX from 'xlsx';
import { config } from 'src/app/config/config';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { Attachment } from 'src/app/shared/interface/attachment.interface';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { StatusService } from 'src/app/services/status/status.service';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'searchFilter',
})

//search รวมทุก field
export class SearchPipe implements PipeTransform {
    transform(value: any, args: any, filter: any): any {
        if (value) {
            return value.filter((val: Call) => {
                if (filter === 'all') {
                    if (!args) return true;
                    return Object.values(val).some((field) => field && field.toString().toLocaleLowerCase().includes(args));
                } else {
                    return Object.values(val).some((field) => field && field.toString().toLocaleLowerCase().includes(filter));
                }
            });
        }
    }
}
@Component({
    selector: 'app-call',
    templateUrl: './call.component.html',
    styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit {
    value: string | undefined;

    calls: any[] = [];
    selectedCalls: any = [];
    newDateFilterType: any | undefined;

    faPenToSquare = faPenToSquare;
    faTrashCan = faTrashCan;
    faArrowRight = faArrowRight;
    faArrowLeft = faArrowLeft;
    faCircleXmark = faCircleXmark;

    visibleRightSideBar: boolean = true;
    visibleLeftSideBar: boolean = true;
    detailItem: any = undefined;
    emptyItem: String = 'ว่าง';
    itemIdex: number = 0;
    isAction: boolean = false;
    sideBarItemIndex: number = 0;

    pageSizeOptions = [15, 50, 100];
    pageSize = 15;
    currentPage = 1;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

    filterOption!: any[];
    selectedFilter: any | undefined;

    valueSearch!: string;

    userId: string = '';

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userRole: string = '';

    sortId: string = 'createdAt';
    sortOrder: string = 'DESC';
    sortIcon: string = '';
    checkedValues: any;
    selectValue: number[] = [];
    call_id: any;

    fileType: string = config.file.type;

    inbound = config.operationType.inbound;
    outbound = config.operationType.outbound;

    filterDate!: any[];

    startDate: any | undefined;
    endDate: any | undefined;
    filterDateType: any | undefined;
    dateFilterType: string = '';
    dateRangeForm!: FormGroup;

    attachmentShowing: boolean = false;
    cType: string = '';
    callId: string = '';
    selectedCasesubject: any;
    selectedCaseTopics: string | null = null;
    selectedChannels: any;
    currentChannel: any;
    channels: any;
    activitiestype: any;
    timepickStart: { hour: number; minute: number; second: number } = { hour: 0, minute: 0, second: 0 };
    activityTypeId: any;
    newDateTime: any;
    startTime: string = '';
    solutions: string = '';
    description: string = '';
    combinedDateTimeStart: string = '';
    combinedDateTimeEnd: string = '';

    selectedActivityTopicId: string[] = [];
    searchContactShowing: boolean = false;

    selectedCallTypeId: string = '';
    activityTypeById: any;
    activitiesTopic: any;
    selectedCheckboxIds: any;

    SearchFormShowing: boolean = true;

    AddCallShowing: boolean = false;

    caseCodes: any[] = [];
    caseTypes: any[] = [];
    serviceGroups: any[] = [];
    serviceTypes: any[] = [];
    serviceSubTypes: any[] = [];
    callTypes: any;

    isCheckboxSelected: { [key: number]: boolean } = {};

    FormShowing: boolean = false;

    thanks: boolean = false;

    AddContactShowing: boolean = false;

    showContactSidebar: boolean = false;

    attachments: Attachment[] = [];
    attachmentsId: string[] | undefined;

    contactId: string = '';
    phoneCall: string = '';

    selectedContactNumber: { contactNumber: string; contactNumberId: string } | null = null;
    contactNumber: any;
    statusList: any[] = [];
    selectedStatus: any;

    comment: any;
    comments: any[] = [];

    selectedCaseCode: any = null;
    selectedCaseCodeObject: any = null;
    selectedCaseType: any = null;
    selectedServiceGroup: any = null;
    selectedServiceType: any = null;
    selectedServiceSubType: any = null;
    chatId: string = '';
    chatHistory: any[] = [];
    activeScriptTab: 'script' | 'chat' = 'script';

    // Sentiment
    sentiments: any[] = [];
    selectedSentiment: number | null = null;

    isStatusDisabled: boolean = false;
    isChannelDisabled: boolean = false;
    isCallTypeDisabled: boolean = false;
    isContactNumberDisabled: boolean = false;
    isDateDisabled: boolean = false;
    isDescriptionDisabled: boolean = false;

    callStatus: any[] = [];
    selectedCallStatusId: number | null = null;
    callStatusId: any;
    history: any[] = [];

    // Autocomplete controls
    codeControl = new FormControl('');
    caseTypeControl = new FormControl('');
    serviceGroupControl = new FormControl('');
    serviceTypeControl = new FormControl('');
    serviceSubTypeControl = new FormControl('');
    filteredCodes: any[] = [];
    filteredCaseTypes: any[] = [];
    filteredServiceGroups: any[] = [];
    filteredServiceTypes: any[] = [];
    filteredServiceSubTypes: any[] = [];

    originalStatus: any;

    constructor(
        private callService: CallService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private userService: UserService,
        private sweetalertServices: SweetAlertService,
        private fb: FormBuilder,
        private contactsService: ContactsService,
        private attachmentService: AttachmentService,
        private auditLogService: AuditLogService,
        private callListService: CallListService,
        public statusService: StatusService,
        private translate: TranslateService,
    ) {
        this.startTime = this.formatDate(new Date());
    }

    ngOnInit() {
        this.getUserData();

        this.userRole = this.userData.role.roleTitle.toLocaleLowerCase();
        this.filterOption = [
            { name: this.translate.instant('filter.all'), code: 'all' },
            { name: this.translate.instant('filter.onlyMy'), code: this.userData.username },
        ];

        this.filterDate = [
            { name: this.translate.instant('filter.pleaseSelectDate'), type: '' },
            { name: this.translate.instant('filter.today'), type: 'toDay' },
            { name: this.translate.instant('filter.thisWeek'), type: 'thisWeek' },
            { name: this.translate.instant('filter.thisMonth'), type: 'thisMonth' },
            { name: this.translate.instant('filter.customDate'), type: 'custom' },
        ];

        this.activeRoute.queryParams.subscribe((params) => {
            if (params['cb'] != undefined && params['cb'] != '') {
                const cbArray = params['cb'].split(',').map(Number);
                this.pageSize = cbArray[0];
                this.currentPage = cbArray[1];
                this.totalItems = cbArray[2];
                this.totalPages = cbArray[3];
            }
        });

        this.selectedFilter = this.filterOption[0].code;
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        }

        this.filterDateType = this.filterDate[0].type;

        this.getCallsData((this.currentPage - 1) * this.currentPage, this.pageSize);
        this.getPage();

        this.dateRangeForm = this.fb.group({
            startDate: [''],
            endDate: [''],
        });

        this.dateRangeForm.get('startDate')!.valueChanges.subscribe((value) => {
            this.startDate = moment(value).format('YYYY-MM-DD');
            this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
            this.getPage();
        });

        this.dateRangeForm.get('endDate')!.valueChanges.subscribe((value) => {
            this.endDate = moment(value).format('YYYY-MM-DD');
            this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
            this.getPage();
        });

        this.callTypes = [
            { id: '1', name: this.inbound },
            { id: '2', name: this.outbound },
        ];

        this.getStatusList();
        this.getCallStatus();
        this.getSentiments();
    }

    getComment(caseId: string) {
        this.callListService.getComment(caseId).subscribe((res: any) => {
            this.comments = res;
        });
    }

    onUserSelectDateFilter(newDateFilterType: string) {
        this.updateDateFilterAndRefreshData(newDateFilterType, (this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    onDateFilterChange(newDateFilterType: string) {
        this.filterDateType = newDateFilterType;
        this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    onUserFilterChange(newUserFilterType: string) {
        this.selectedFilter = newUserFilterType;
        this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    updateDateFilterAndRefreshData(newDateFilterType: string, page: number, pageSize: number) {
        this.onDateFilterChange(newDateFilterType);
    }

    async getCallsData(page: number, pageSize: number) {
        let userFilter = '';
        if (this.selectedFilter === 'all') {
            userFilter = this.selectedFilter;
        } else {
            userFilter = this.userData.userId;
        }
        await this.callService
            .getCasesPage(
                page,
                pageSize,
                `${this.sortId},${this.sortOrder}`,
                this.valueSearch,
                userFilter,
                this.filterDateType,
                this.startDate,
                this.endDate,
            )
            .subscribe((res: any) => {
                this.calls = res;
                this.calls.forEach((call) => {
                    if (call.type === 'I') {
                        call.type = this.inbound;
                    } else if (call.type === 'O') {
                        call.type = this.outbound;
                    }
                });
            });
    }

    async getPage() {
        let userFilter = '';
        if (this.selectedFilter === 'all') {
            userFilter = this.selectedFilter;
        } else {
            userFilter = this.userData.userId;
        }

        console.log('user: ', userFilter);
        await this.callService
            .getCallsCount(this.valueSearch, userFilter, this.filterDateType, this.startDate, this.endDate)
            .subscribe((res: any) => {
                this.totalItems = res.count;
            });
    }

    async getCallsSide(page: number, pageSize: number, value: string) {
        await this.callService
            .getContactByPage(page, pageSize, `${this.sortId},${this.sortOrder}`, this.valueSearch, this.selectedFilter)
            .subscribe((res: any) => {
                this.calls = res;
            })
            .add(() => {
                if (value == 'right') this.showSideBar(0, this.calls[0].callId);
                else if (value == 'left') this.showSideBar(this.pageSize - 1, this.calls[this.pageSize - 1].callId);
            });
    }

    showSideBar(value: number, itemId: string) {
        console.log('SideBar');
        this.itemIdex = value;
        this.detailItem = this.calls[this.itemIdex];
        this.detailItem = this.calls.find((calls: any) => calls.callId == itemId);
        this.sideBarItemIndex = this.calls.findIndex((calls: any) => calls.callId == itemId);
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;

        if (this.itemIdex == 0 && this.currentPage == 1) this.visibleLeftSideBar = false;
        if (this.itemIdex == this.calls.length - 1) this.visibleRightSideBar = false;
        if (this.itemIdex == this.calls.length - 1 && this.currentPage == this.totalPages) this.visibleRightSideBar = false;
    }

    editPage() {
        this.router.navigate(['/call/edit']);
    }

    get pages(): number[] {
        var page: number[] = [];
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        for (var i = -this.pagesToShow; i <= this.pagesToShow; i++) {
            if (this.currentPage + i > 0 && this.currentPage + i <= this.totalPages) {
                page.push(this.currentPage + i);
            }
        }
        return page;
    }

    async pageChange(page: number) {
        if (page != this.currentPage) {
            if (page >= 0 && page <= this.totalPages) {
                this.currentPage = page;
                await this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
                this.checkedValues = [];
            }
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    async changeSideBar(value: string) {
        if (value == 'right') {
            if (this.itemIdex >= this.pageSize - 1) {
                await this.pageChangeSideBar(this.currentPage + 1, value);
            } else {
                if (this.itemIdex != this.calls.length - 1) {
                    this.showSideBar(this.itemIdex + 1, this.calls[this.sideBarItemIndex + 1].callId);
                }
            }
        } else if (value == 'left') {
            if (this.itemIdex == 0) {
                await this.pageChangeSideBar(this.currentPage - 1, value);
            } else {
                this.showSideBar(this.itemIdex - 1, this.calls[this.sideBarItemIndex - 1].callId);
            }
        }
    }

    pageChangeSideBar(page: number, value: string): void {
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.getCallsSide((this.currentPage - 1) * this.pageSize, this.pageSize, value);
            }
        }
    }

    search() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    sort(value: string) {
        if (this.sortId == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrder = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrder = 'ASC';
            }
        } else {
            this.sortId = value;
        }
        this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    createCallFideId(item: any, contactId: any, caller: any) {
        this.router.navigate(['/contacts/edit'], { queryParams: { callId: item.callId, key: item.contactId, caller: item.caller } });
    }

    createCall() {
        this.router.navigate(['/call/create-call']);
    }

    getUserData() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAction = res?.role.roleTitle.toLocaleLowerCase() === 'admin' ? true : false;
        });
    }

    exportExcel() {
        if (this.selectValue.length != 0) {
            this.selectedCalls = this.calls.filter((calls: any) => this.selectValue.includes(calls.caseId));
        } else {
            this.selectedCalls = [];
        }
        if (this.selectedCalls.length != 0) {
            const processedForms = this.selectedCalls.reduce(
                (acc: any, cur: any) => [
                    ...acc,
                    {
                        createdAt: cur.createdAt,
                        channel: cur.channel,
                        callType: cur.type,
                        caseCode: cur.casecode,
                        assignDate: cur.assignDate,
                        assignUser: cur.agent,
                        caseType: cur.casetype,
                        serviceGroup: cur.caseServiceGroup,
                        serviceType: cur.caseServiceType,
                        serviceSubType: cur.caseServiceSubType,
                        description: cur.description,
                        comment: cur.comment,
                        contact: cur.contact,
                        callStatus: cur.callStatusName,
                        caseStatus: cur.status,
                    },
                ],
                [],
            );

            const columns = [
                [
                    this.translate.instant('common.time'),
                    this.translate.instant('contact.channel'),
                    this.translate.instant('contact.callType'),
                    this.translate.instant('contact.code'),
                    this.translate.instant('contact.assignDate'),
                    this.translate.instant('contact.assignUser'),
                    this.translate.instant('contact.caseType'),
                    this.translate.instant('contact.serviceGroup'),
                    this.translate.instant('contact.serviceType'),
                    this.translate.instant('contact.serviceSubType'),
                    this.translate.instant('contact.description'),
                    this.translate.instant('contact.comment'),
                    this.translate.instant('contact.contact'),
                    this.translate.instant('contact.callStatus'),
                    this.translate.instant('common.status'),
                ],
            ];
            const wb = XLSX.utils.book_new();
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws, columns);

            XLSX.utils.sheet_add_json(ws, processedForms, { origin: 'A2', skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            XLSX.writeFile(wb, `ประวัติการโทร${this.fileType}`);
        }
    }

    selectCheckbox(callId: number): void {
        console.log('callId: ', callId);
        if (this.selectValue.includes(callId)) {
            this.selectValue = this.selectValue.filter((id) => id !== callId);
        } else {
            this.selectValue.push(callId);
        }
    }

    checkAll(ev: any) {
        this.calls.forEach((x: any) => {
            x.state = ev.target.checked;
            if (ev.target.checked) {
                this.selectValue.push(x.caseId);
            } else {
                this.selectValue = [];
            }
        });
    }

    isAllChecked() {
        return this.calls && this.calls.every((_: any) => _.state);
    }

    time = true;
    time1 = true;
    meridian = true;
    seconds = true;
    seconds1 = true;

    date = new FormControl(new Date());

    showAddCall() {
        this.selectedChannels = '';
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.thanks = false;
        this.AddCallShowing = true;

        this.callService.getCaseCode().subscribe((caseCodes: any) => {
            this.caseCodes = caseCodes;
            this.filteredCodes = caseCodes;
        });

        this.callService.getCaseType().subscribe((caseTypes: any) => {
            this.caseTypes = caseTypes;
            this.filteredCaseTypes = caseTypes;
        });

        this.callService.getCaseServiceGroup().subscribe((serviceGroups: any) => {
            this.serviceGroups = serviceGroups;
            this.filteredServiceGroups = serviceGroups;
        });

        this.callService.getCaseServiceType().subscribe((serviceTypes: any) => {
            this.serviceTypes = serviceTypes;
            this.filteredServiceTypes = serviceTypes;
        });

        this.callService.getServiceSubType().subscribe((serviceSubTypes: any) => {
            this.serviceSubTypes = serviceSubTypes;
            this.filteredServiceSubTypes = serviceSubTypes;
        });

        this.callService.getAllChannels().subscribe((channels: any) => {
            this.channels = channels;
            this.selectedChannels = this.currentChannel || '';
        });
    }

    editCall(callId: string, contactId: string) {
        console.log('callId: ', callId);
        console.log('contactId: ', contactId);
        this.currentChannel = '';
        this.attachmentShowing = false;
        this.cType = '';
        this.callId = '';
        this.selectedChannels = '';
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
        this.selectedCaseCode = null;
        this.selectedCaseCodeObject = null;
        this.selectedCaseType = null;
        this.selectedServiceGroup = null;
        this.selectedServiceType = null;
        this.selectedServiceSubType = null;
        this.selectedActivityTopicId = [];

        this.isStatusDisabled = false;
        this.isChannelDisabled = true;
        this.isCallTypeDisabled = true;
        this.isContactNumberDisabled = true;
        this.isDateDisabled = true;
        this.isDescriptionDisabled = false;

        this.codeControl.disable();
        this.caseTypeControl.disable();
        this.serviceGroupControl.disable();
        this.serviceTypeControl.disable();
        this.serviceSubTypeControl.disable();

        this.callService.getCaseCode().subscribe((caseCodes: any) => {
            this.caseCodes = caseCodes;
            this.filteredCodes = caseCodes;

            this.callService.getCaseType().subscribe((caseTypes: any) => {
                this.caseTypes = caseTypes;
                this.filteredCaseTypes = caseTypes;

                this.callService.getCaseServiceGroup().subscribe((serviceGroups: any) => {
                    this.serviceGroups = serviceGroups;
                    this.filteredServiceGroups = serviceGroups;

                    this.callService.getCaseServiceType().subscribe((serviceTypes: any) => {
                        this.serviceTypes = serviceTypes;
                        this.filteredServiceTypes = serviceTypes;

                        this.callService.getServiceSubType().subscribe((serviceSubTypes: any) => {
                            this.serviceSubTypes = serviceSubTypes;
                            this.filteredServiceSubTypes = serviceSubTypes;

                            this.callService.getCaseById(callId).subscribe(
                                (call: any) => {
                                    if (!call) {
                                        console.error('Case not found:', callId);
                                        return;
                                    }

                                    this.cType = 'case';
                                    this.callId = call.caseId;
                                    this.description = call.description;
                                    this.startTime = call.requestDateTime;
                                    this.originalStatus = call.statusId;
                                    const date = new Date(call.requestDateTime);
                                    this.timepickStart = {
                                        hour: date.getHours(),
                                        minute: date.getMinutes(),
                                        second: date.getSeconds(),
                                    };
                                    this.selectedChannels = call.channelId;
                                    this.currentChannel = call.channelId;
                                    this.selectedCallTypeId = call.operationType;
                                    if (call.contactNumber) {
                                        this.selectedContactNumber = {
                                            contactNumber: call.contactNumber,
                                            contactNumberId: call.contactNumberId || null,
                                        };
                                    }
                                    this.selectedStatus = call.statusId;
                                    this.selectedSentiment = call.sentimentId;

                                    // Set codeControl value
                                    if (call.caseCodeId) {
                                        this.selectedCaseCode = call.caseCodeId;
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

                                    // Set caseTypeControl value
                                    if (call.caseTypeId) {
                                        this.selectedCaseType = call.caseTypeId;
                                        const selectedCaseType = this.caseTypes.find((type: any) => type.id == call.caseTypeId);
                                        if (selectedCaseType) {
                                            this.caseTypeControl.setValue(selectedCaseType);
                                        }
                                    } else {
                                        this.selectedCaseType = null;
                                        this.caseTypeControl.setValue('');
                                    }

                                    // Set serviceGroupControl value
                                    if (call.caseServiceGroupId) {
                                        this.selectedServiceGroup = call.caseServiceGroupId;
                                        const selectedServiceGroup = this.serviceGroups.find(
                                            (group: any) => group.id == call.caseServiceGroupId,
                                        );
                                        if (selectedServiceGroup) {
                                            this.serviceGroupControl.setValue(selectedServiceGroup);
                                        }
                                    } else {
                                        this.selectedServiceGroup = null;
                                        this.serviceGroupControl.setValue('');
                                    }

                                    // Set serviceTypeControl value
                                    if (call.caseServiceTypeId) {
                                        this.selectedServiceType = call.caseServiceTypeId;
                                        const selectedServiceType = this.serviceTypes.find(
                                            (type: any) => type.id == call.caseServiceTypeId,
                                        );
                                        if (selectedServiceType) {
                                            this.serviceTypeControl.setValue(selectedServiceType);
                                        }
                                    } else {
                                        this.selectedServiceType = null;
                                        this.serviceTypeControl.setValue('');
                                    }

                                    // Set serviceSubTypeControl value
                                    if (call.caseServiceSubTypeId) {
                                        this.selectedServiceSubType = call.caseServiceSubTypeId;
                                        const selectedServiceSubType = this.serviceSubTypes.find(
                                            (subType: any) => subType.id == call.caseServiceSubTypeId,
                                        );
                                        if (selectedServiceSubType) {
                                            this.serviceSubTypeControl.setValue(selectedServiceSubType);
                                        }
                                    } else {
                                        this.selectedServiceSubType = null;
                                        this.serviceSubTypeControl.setValue('');
                                    }

                                    this.getComment(call.caseId);
                                    this.getChatHistory(call.chatId);
                                    this.getHistory(call.caseId);
                                    this.selectedCallStatusId = call.callStatus;
                                    this.getCallStatusId(call.callStatusId?.toString() || '');
                                },
                                (error) => {
                                    console.error('Error fetching case:', error);
                                },
                            );
                        });
                    });
                });
            });
        });

        this.showAddCall();
        this.getContactNumber(contactId);
    }

    toggleCheckbox(activityTopicId: number) {
        const index = this.selectedCheckboxIds.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedCheckboxIds.push(activityTopicId);
        } else {
            this.selectedCheckboxIds.splice(index, 1);
        }
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

    onCheckboxChange(event: any, activityTypeId: number) {
        this.isCheckboxSelected[activityTypeId] = event.target.checked;
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

    submitCall() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        const selectedDate = this.startTime ? this.formatDate(new Date(this.startTime)) : this.formatDate(new Date());
        const selectedTime = this.timepickStart ? this.formatTime(this.timepickStart) : this.formatTime(new Date());

        const isChannelOne = this.selectedChannels === '1';
        const selectedCallTypeId = isChannelOne ? this.selectedCallTypeId : null;

        if (!this.callId) {
            if (this.selectedCaseCode) {
                const data = {
                    contactId: this.contactId,
                    name: userData.userId,
                    caseCodeId: this.selectedCaseCode,
                    caseTypeId: this.selectedCaseType,
                    caseServiceGroupId: this.selectedServiceGroup,
                    caseServiceTypeId: this.selectedServiceType,
                    caseServiceSubTypeId: this.selectedServiceSubType,
                    channel: this.selectedChannels,
                    activityType: this.activityTypeId,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    solution: this.solutions,
                    createdById: userData.userId,
                    attachment: this.attachmentsId,
                    call_id: this.phoneCall,
                    operationType: selectedCallTypeId,
                    comment: this.comment,
                    sentimentId: this.selectedSentiment,
                };
                console.log('Data: ', data);
                this.callService
                    .createCalls(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.success('alert.saveSuccess');
                            this.auditLogService.log(
                                '',
                                'Contact Create Call',
                                '',
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
                                '',
                                'Contact Create Case Call',
                                JSON.stringify(data),
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.error('alert.pleaseEnterCode');
            }
        } else if (this.callId && this.cType === 'case') {
            console.log('Edit Case:', this.callId);
            if (this.selectedCaseCode) {
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
                    operationType: selectedCallTypeId,
                    status: this.selectedStatus,
                    comment: this.comment,
                    callStatus: this.selectedCallStatusId,
                    sentimentId: this.selectedSentiment,
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
                console.log('Data: ', data);
                this.callService
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
                            window.location.reload();
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
                this.sweetalertServices.error('alert.pleaseEnterCode');
            }
        }
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
            const existingCode = this.caseCodes.find((c: any) => c.code.toLowerCase() === selectedCode.code.toLowerCase());

            if (existingCode) {
                this.selectedCaseCode = existingCode.id;
                this.selectedCaseCodeObject = existingCode;
                this.codeControl.setValue(existingCode);
                this.filteredCodes = [...this.caseCodes];
                return;
            }

            this.callService
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
                        this.caseCodes.push(res);
                        this.filteredCodes = [...this.caseCodes];
                    },
                    error: (error) => {
                        console.error('Error creating case code:', error);
                        this.sweetalertServices.handleError(error);
                    },
                });
        } else {
            this.selectedCaseCode = selectedCode.id;
            this.selectedCaseCodeObject = selectedCode;
        }
    }

    onCaseTypeSelected(event: any) {
        const selectedCaseType = event.option.value;

        if (selectedCaseType.isNew) {
            const existingCaseType = this.caseTypes.find((t: any) => t.name.toLowerCase() === selectedCaseType.name.toLowerCase());

            if (existingCaseType) {
                this.selectedCaseType = existingCaseType.id;
                this.caseTypeControl.setValue(existingCaseType);
                this.filteredCaseTypes = [...this.caseTypes];
                return;
            }

            this.callService
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
                    },
                    error: (error) => {
                        console.error('Error creating case type:', error);
                        this.sweetalertServices.handleError(error);
                    },
                });
        } else {
            this.selectedCaseType = selectedCaseType.id;
        }
    }

    onServiceGroupSelected(event: any) {
        const selectedServiceGroup = event.option.value;

        if (selectedServiceGroup.isNew) {
            const existingServiceGroup = this.serviceGroups.find(
                (g: any) => g.name.toLowerCase() === selectedServiceGroup.name.toLowerCase(),
            );

            if (existingServiceGroup) {
                this.selectedServiceGroup = existingServiceGroup.id;
                this.serviceGroupControl.setValue(existingServiceGroup);
                this.filteredServiceGroups = [...this.serviceGroups];
                return;
            }

            this.callService
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
                    },
                    error: (error) => {
                        console.error('Error creating service group:', error);
                        this.sweetalertServices.handleError(error);
                    },
                });
        } else {
            this.selectedServiceGroup = selectedServiceGroup.id;
        }
    }

    onServiceTypeSelected(event: any) {
        const selectedServiceType = event.option.value;

        if (selectedServiceType.isNew) {
            const existingServiceType = this.serviceTypes.find((t: any) => t.name.toLowerCase() === selectedServiceType.name.toLowerCase());

            if (existingServiceType) {
                this.selectedServiceType = existingServiceType.id;
                this.serviceTypeControl.setValue(existingServiceType);
                this.filteredServiceTypes = [...this.serviceTypes];
                return;
            }

            this.callService
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
                    },
                    error: (error) => {
                        console.error('Error creating service type:', error);
                        this.sweetalertServices.handleError(error);
                    },
                });
        } else {
            this.selectedServiceType = selectedServiceType.id;
        }
    }

    onServiceSubTypeSelected(event: any) {
        const selectedServiceSubType = event.option.value;

        if (selectedServiceSubType.isNew) {
            const existingServiceSubType = this.serviceSubTypes.find(
                (st: any) => st.name.toLowerCase() === selectedServiceSubType.name.toLowerCase(),
            );

            if (existingServiceSubType) {
                this.selectedServiceSubType = existingServiceSubType.id;
                this.serviceSubTypeControl.setValue(existingServiceSubType);
                this.filteredServiceSubTypes = [...this.serviceSubTypes];
                return;
            }

            this.callService
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
                    },
                    error: (error) => {
                        console.error('Error creating service sub type:', error);
                        this.sweetalertServices.handleError(error);
                    },
                });
        } else {
            this.selectedServiceSubType = selectedServiceSubType.id;
        }
    }

    async getContactNumber(contactsId: string) {
        try {
            const contactNumber = (await this.callService.getContactNumbertById(contactsId).toPromise()) as any[];
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

    onChannelChange(event: any) {
        this.currentChannel = event;
        console.log('currentChannel:', this.currentChannel);

        if (event === '1') {
            this.selectedCallTypeId = this.outbound;
        } else if (event && event !== '3') {
            this.selectedCallTypeId = this.inbound;
        }
    }

    checkSupRole(): boolean {
        if (this.userRole === 'super admin' || this.userRole === 'admin') {
            return true;
        } else {
            return false;
        }
    }

    getStatusList() {
        this.callListService.getStatusList().subscribe((res: any) => {
            this.statusList = res;
        });
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

    getCallStatusId(callStatusId: string) {
        this.callListService.getCallStatusId(callStatusId).subscribe((res: any) => {
            this.callStatusId = res;
        });
        console.log('callStatusId: ', this.callStatusId);
    }

    getHistory(caseId: string) {
        this.callListService.getHistory(caseId).subscribe((res: any) => {
            this.history = res;
        });
    }

    getSentiments() {
        this.callService.getSentiment().subscribe((res: any) => {
            this.sentiments = res;
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
}
