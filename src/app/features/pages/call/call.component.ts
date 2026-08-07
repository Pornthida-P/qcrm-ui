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
import { colors } from 'src/app/shared/theme/colors';
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

    caseTopicsList: any[] = [];
    caseTypes: any[] = [];
    caseSubjects: any[] = [];
    allCaseSubjects: any[] = [];
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

    selectedCaseType: any = null;
    selectedCaseTopic: any = null;
    selectedCaseSubject: any = null;
    chatId: string = '';
    chatHistory: any[] = [];

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
    caseTypeControl = new FormControl('');
    caseTopicControl = new FormControl('');
    caseSubjectControl = new FormControl('');
    filteredCaseTypes: any[] = [];
    filteredCaseTopics: any[] = [];
    filteredCaseSubjects: any[] = [];

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

        // Subscribe to language changes to update filter options
        this.translate.onLangChange.subscribe(() => {
            this.updateFilterOptions();
        });

        this.activeRoute.queryParams.subscribe((params) => {
            if (params['cb'] != undefined && params['cb'] != '') {
                const cbArray = params['cb'].split(',').map(Number);
                this.pageSize = cbArray[0];
                this.currentPage = cbArray[1];
                this.totalItems = cbArray[2];
                this.totalPages = cbArray[3];
            }

            // Handle agentId filter from query params
            if (params['agentId'] != undefined && params['agentId'] != '') {
                this.selectedFilter = params['agentId'];
                this.userId = params['agentId'];
                // Reload data when agent filter is applied
                this.currentPage = 1;
                this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
                this.getPage();
            } else if (!params['agentId']) {
                // Only set default if agentId is not in params
                if (this.selectedFilter === 'all' || !this.selectedFilter) {
                    this.selectedFilter = 'all';
                    this.userId = '';
                }
            }
        });

        // Initialize with default or query param value
        const agentIdParam = this.activeRoute.snapshot.queryParams['agentId'];
        if (agentIdParam) {
            this.selectedFilter = agentIdParam;
            this.userId = agentIdParam;
        } else {
            this.selectedFilter = 'all';
            this.userId = '';
        }

        this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
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
        console.log('selectedFilter: ', this.selectedFilter);
        if (this.selectedFilter === 'all') {
            userFilter = this.selectedFilter;
        } else {
            // This handles the case where an agent's userId is selected
            userFilter = this.selectedFilter;
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
                console.log('res: ', res);
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
            userFilter = this.selectedFilter;
        }
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

    onSearchInput() {
        this.search();
    }

    search() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.currentPage = 1;
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
            this.userRole = res?.role.roleTitle.toLocaleLowerCase() || '';
            this.updateFilterOptions();
        });
    }

    exportExcel() {
        if (this.selectValue.length != 0) {
            this.selectedCalls = this.calls.filter((calls: any) => this.selectValue.includes(calls.caseId));
        } else {
            this.selectedCalls = this.calls;
        }
        if (this.selectedCalls.length != 0) {
            const processedForms = this.selectedCalls.map((cur: any) => {
                // Parse date and time
                const dateTime = cur.requestDateTime || cur.createdAt;
                const dateObj = moment(dateTime);
                const dateStr = dateObj.format('D/M/YYYY');
                const timeDecimal = dateObj.format('H.mm');
                const time12Hour = dateObj.format('h:mm A');
                const monthStr = dateObj.format('MMM-YY');

                // Determine time period (Morning/Afternoon)
                const hour = dateObj.hour();
                const timePeriod = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

                // Format assign date
                const assignDateStr = cur.assignDate ? moment(cur.assignDate).format('D/M/YYYY') : '';

                // Get sentiment name
                const sentimentName = cur.sentiment || '';

                // Get contact information - try multiple sources
                const contactName = cur.contact || cur.contactName || cur.firstName || cur.lastName || '';
                const displayName = cur.displayName || cur.contact || cur.firstName || cur.lastName || '';

                // Get car ID
                

                // Get satisfaction (if available)
                const satisfaction = cur.satisfaction || '';

                // Service Detail (from description)
                const serviceDetail = cur.description || '';

                // Note (from comment)
                const note = cur.comment || '';

                // Customer group / contact type
                const customerGroup = cur.contactType || cur.type || '';

                // ประเภทของการติดต่อ - from caseType
                const contactCategory = cur.caseType || cur.casetype || '';

                return {
                    date: dateStr,
                    time: timeDecimal,
                    time2: time12Hour,
                    month: monthStr,
                    timePeriod: timePeriod,
                    caseId: cur.caseIdForReport || '',
                    channel: cur.channel || '',
                    contactType: cur.type || '',
                    assignDate: assignDateStr,
                    customerGroup: customerGroup,
                    contactCategory: contactCategory,
                    caseTopic: cur.caseTopic || '',
                    caseSubject: cur.caseSubject || '',
                    serviceDetail: serviceDetail,
                    note: note,
                    contactTime: timeDecimal,
                    sentiment: sentimentName,
                    contactName: contactName,
                    profileName: displayName,
                    callStatus: cur.callStatusName || '',
                    status: cur.status || '',
                    satisfaction: satisfaction,
                };
            });

            const columns = [
                [
                    'วันที่',
                    'เวลา',
                    'เวลา 2',
                    'เดือน',
                    'ช่วงเวลาการติดต่อ',
                    'Case ID',
                    'Channel',
                    'Contact Type',
                    'Assign Date - Outbound',
                    'Customer Group',
                    'ประเภทของการติดต่อ',
                    'หัวข้อการติดต่อ\n(Case Topic)',
                    'เรื่องที่ติดต่อ\n(Case Subject)',
                    'Service Detail',
                    'Note',
                    'เวลาติดต่อ',
                    'Sentiment',
                    'ชื่อผู้ติดต่อ',
                    'ชื่อโปรไฟล์',
                    'สถานะการติดต่อ',
                    'สถานะ\n(Status)',
                    'ความพึงพอใจ',
                ],
            ];

            const wb = XLSX.utils.book_new();
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws, columns);

            XLSX.utils.sheet_add_json(ws, processedForms, { origin: 'A2', skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            XLSX.writeFile(wb, `ประวัติการโทร_${moment().format('DD-MM-YYYY_HH-mm-ss')}${this.fileType}`);
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

        this.callService.getCaseTopics().subscribe((caseTopics: any) => {
            this.caseTopicsList = caseTopics;
            this.filteredCaseTopics = caseTopics;
        });

        this.callService.getCaseType().subscribe((caseTypes: any) => {
            this.caseTypes = caseTypes;
            this.filteredCaseTypes = caseTypes;
        });

        this.callService.getCaseSubjects().subscribe((caseSubjects: any) => {
            this.allCaseSubjects = Array.isArray(caseSubjects) ? caseSubjects : [];
            if (this.selectedCaseTopic) {
                this.loadCaseSubjectsForSelectedTopic(false, this.selectedCaseSubject);
            } else {
                this.clearCaseSubjectSelection();
            }
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
        this.attachments = [];
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
        this.selectedCaseType = null;
        this.selectedCaseTopic = null;
        this.selectedCaseSubject = null;
        this.caseTopicControl.setValue('');
        this.caseSubjectControl.setValue('');
        this.selectedActivityTopicId = [];

        this.isStatusDisabled = false;
        this.isChannelDisabled = true;
        this.isCallTypeDisabled = true;
        this.isContactNumberDisabled = true;
        this.isDateDisabled = true;
        this.isDescriptionDisabled = false;

        this.disableFormControlsForAgent();

        this.callService.getCaseTopics().subscribe((caseTopics: any) => {
            this.caseTopicsList = caseTopics;
            this.filteredCaseTopics = caseTopics;
        });

        this.callService.getCaseType().subscribe((caseTypes: any) => {
            this.caseTypes = caseTypes;
            this.filteredCaseTypes = caseTypes;
        });

        this.callService.getCaseSubjects().subscribe((caseSubjects: any) => {
            this.allCaseSubjects = Array.isArray(caseSubjects) ? caseSubjects : [];
        });

        this.callService.getCaseById(callId).subscribe(
            (call: any) => {
                if (!call) {
                    console.error('Case not found:', callId);
                    return;
                }

                console.log('Edit Call: ', call);
                this.cType = 'case';
                this.callId = call.caseId;
                this.description = call.description;
                this.startTime = call.requestDateTime;
                this.originalStatus = call.statusId;
                const requestDate = new Date(call.requestDateTime);
                this.timepickStart = {
                    hour: requestDate.getHours(),
                    minute: requestDate.getMinutes(),
                    second: requestDate.getSeconds(),
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
                const rawAttachments =
                    call.attachment ||
                    call.attachments ||
                    (call.filePath || call.fileName || call.fullname ? call : []);
                this.attachments = this.normalizeAttachments(rawAttachments);

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

                if (call.caseTopicId) {
                    this.selectedCaseTopic = call.caseTopicId;
                    const selectedCaseTopic = this.caseTopicsList.find(
                        (topic: any) => topic.caseTopicId == call.caseTopicId || topic.id == call.caseTopicId,
                    );
                    if (selectedCaseTopic) {
                        this.caseTopicControl.setValue(selectedCaseTopic);
                    }
                    this.loadCaseSubjectsForSelectedTopic(false, call.caseSubjectId);
                } else {
                    this.selectedCaseTopic = null;
                    this.caseTopicControl.setValue('');
                    this.clearCaseSubjectSelection();
                }

                this.disableFormControlsForAgent();
                this.getComment(call.caseId);
                this.getChatHistory(call.chatId);
                this.chatId = call.chatId || '';
                this.getHistory(call.caseId);
                this.selectedCallStatusId = call.callStatus;
                this.getCallStatusId(call.callStatusId?.toString() || '');
            },
            (error) => {
                console.error('Error fetching case:', error);
            },
        );

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

    onDeleteAttachment(attachmentId: string) {
        this.attachments = this.attachments.filter((attachment) => attachment.attachmentId !== attachmentId);
    }

    get canUploadAttachments(): boolean {
        return this.attachmentShowing || this.cType === 'case';
    }

    private normalizeAttachments(raw: any): Attachment[] {
        if (!raw) {
            return [];
        }

        const parsed = this.tryParseAttachment(raw);
        const list = Array.isArray(parsed) ? parsed : [parsed];

        return list
            .filter((item) => item && typeof item === 'object')
            .map((item: any) => {
                const filepath = item.filepath || item.filePath || item.path || item.url || '';
                const fallbackFilename = filepath ? filepath.split('/').pop() || '' : '';

                return {
                    attachmentId: item.attachmentId || item.id || item.attachment_id || '',
                    caseId: item.caseId || item.case_id || this.callId || '',
                    filename: item.filename || item.fileName || item.name || item.fullname || fallbackFilename,
                    filepath: filepath,
                    fileType: item.fileType || item.mimeType || item.mimetype || null,
                    fileSize: item.fileSize || item.size || null,
                    createdAt: item.createdAt || item.created_at || null,
                    createdById: item.createdById || item.created_by || null,
                    modifiedAt: item.modifiedAt || item.modified_at || null,
                    modifiedById: item.modifiedById || item.modified_by || null,
                    isDeleted: item.isDeleted ?? item.is_deleted ?? null,
                };
            })
            .filter((attachment) => !!(attachment.filename || attachment.filepath));
    }

    private tryParseAttachment(raw: any): any {
        if (typeof raw !== 'string') {
            return raw;
        }

        const trimmed = raw.trim();
        if (!trimmed) {
            return null;
        }

        try {
            return JSON.parse(trimmed);
        } catch {
            return { filePath: trimmed };
        }
    }

    async submitCall() {
        const userData = this.userData || JSON.parse(localStorage.getItem('userData') || '{}');
        this.syncCaseTopicSelectionFromControl();
        this.syncCaseSubjectSelectionFromControl();
        const caseTopicId =
            this.selectedCaseTopic?.caseTopicId ?? this.selectedCaseTopic?.id ?? this.selectedCaseTopic ?? null;
        const caseSubjectId =
            this.selectedCaseSubject?.caseSubjectId ?? this.selectedCaseSubject?.id ?? this.selectedCaseSubject ?? null;
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        const selectedDate = this.startTime ? this.formatDate(new Date(this.startTime)) : this.formatDate(new Date());
        const selectedTime = this.timepickStart ? this.formatTime(this.timepickStart) : this.formatTime(new Date());

        if (!this.callId) {
            if (this.selectedCaseTopic || this.chatId || caseTopicId) {
                const data = {
                    contactId: this.contactId,
                    name: userData.userId,
                    caseTopicId,
                    caseSubjectId,
                    caseTypeId: this.selectedCaseType,
                    channel: this.selectedChannels,
                    activityType: this.activityTypeId,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    solution: this.solutions,
                    createdById: userData.userId,
                    attachment: this.attachmentsId,
                    call_id: this.phoneCall,
                    operationType: this.selectedCallTypeId,
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
            if (this.selectedCaseTopic || this.chatId || caseTopicId || (this.callId && this.cType === 'case')) {
                const data = {
                    callId: this.callId,
                    caseTopicId,
                    caseSubjectId,
                    caseTypeId: this.selectedCaseType,
                    channel: this.selectedChannels,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    modifiedById: userData.userId,
                    operationType: this.selectedCallTypeId,
                    status: this.selectedStatus,
                    comment: this.comment,
                    callStatus: this.selectedCallStatusId,
                    sentimentId: this.selectedSentiment,
                    attachment: this.attachmentsId,
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

    filterCaseTopics() {
        this.syncCaseTopicSelectionFromControl();
        const controlValue = this.caseTopicControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '').toString().trim();
        const filterValue = originalValue.toLowerCase();

        if (!filterValue) {
            this.filteredCaseTopics = [...this.caseTopicsList];
            return;
        }

        this.filteredCaseTopics = this.caseTopicsList.filter((topic: any) => topic.name.toLowerCase().includes(filterValue));
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

        this.filteredCaseSubjects = this.caseSubjects.filter((subject: any) => subject.name.toLowerCase().includes(filterValue));
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

        this.callService.getCaseSubjects(this.selectedCaseTopic).subscribe({
            next: (response: any) => {
                const subjects = Array.isArray(response) ? response : [];
                this.caseSubjects = subjects;
                this.filteredCaseSubjects = [...subjects];

                if (clearSubject) {
                    this.selectedCaseSubject = null;
                    this.caseSubjectControl.setValue('');
                }

                if (!this.isAgent()) {
                    this.caseSubjectControl.enable();
                }

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
            if (!this.isAgent()) {
                this.caseSubjectControl.enable();
            }
        }
    }

    onCaseTopicChanged(): void {
        this.loadCaseSubjectsForSelectedTopic(true);
    }

    displayCaseTypeFn = (caseType: any): string => {
        return caseType?.name || '';
    };

    displayCaseTopicFn = (caseTopic: any): string => {
        return caseTopic?.name || '';
    };

    displayCaseSubjectFn = (caseSubject: any): string => {
        return caseSubject?.name || '';
    };

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

    deleteCall(callId: string, caseIdForReport: string) {
        console.log('Delete Call:', callId);
        Swal.fire({
            icon: 'warning',
            title: this.translate.instant('alert.deleteConfirm'),
            text: caseIdForReport,
            showCancelButton: true,
            confirmButtonText: this.translate.instant('alert.ok'),
            cancelButtonText: this.translate.instant('alert.cancel'),
            confirmButtonColor: colors.blueMid,
            cancelButtonColor: colors.lighterRed,
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
        if (this.userRole.toLowerCase().includes('admin')) {
            return true;
        } else {
            return false;
        }
    }

    isAgent(): boolean {
        // Agent role หรือ role อื่นๆ ที่ไม่ใช่ admin
        return !this.checkSupRole();
    }

    disableFormControlsForAgent(): void {
        if (this.isAgent()) {
            this.caseTypeControl.disable();
            this.caseTopicControl.disable();
            this.caseSubjectControl.disable();
        } else {
            this.caseTypeControl.enable();
            this.caseTopicControl.enable();
            if (this.selectedCaseTopic) {
                this.caseSubjectControl.enable();
            } else {
                this.caseSubjectControl.disable();
            }
        }
    }

    getStatusList() {
        this.callListService.getStatusList().subscribe((res: any) => {
            this.statusList = res;
        });
    }

    getChatHistory(chatId: string) {
        this.callListService.getChatHistory(chatId).subscribe((res: any) => {
            this.chatHistory = (res || []).map((chat: any) => this.normalizeChatMessageData(chat));
        });
    }

    private normalizeChatMessageData(chat: any): any {
        if (!chat) return chat;
        let msgData = chat.message_data;
        if (typeof msgData === 'string') {
            try {
                msgData = JSON.parse(msgData);
            } catch {
                return chat;
            }
        }
        chat.message_data = msgData || {};
        const md = chat.message_data;
        const isLine = (chat.channel_type || chat.channel_name || '').toString().toLowerCase().includes('line');
        if (chat.message_type === 'sticker' && isLine && md.sticker_id && !md.originalContentUrl) {
            md.originalContentUrl = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${md.sticker_id}/android/sticker.png`;
        }
        return chat;
    }

    isRatingMessage(chat: any): boolean {
        return !!(chat?.message_text && chat.message_text.startsWith('rating'));
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

    updateFilterOptions() {
        this.filterOption = [{ name: this.translate.instant('filter.all'), code: 'all' }];

        // Add "Only My" option if userData is available (use userId - API filters by assignedUserId/createdById)
        if (this.userData?.userId) {
            this.filterOption.push({
                name: this.translate.instant('filter.onlyMy'),
                code: this.userData.userId,
            });
        }

        // If admin, fetch all agents and add to filter options
        if (this.checkSupRole()) {
            this.userService.getAllUser().subscribe((users: User[]) => {
                const agents = users.filter((user) => user.role?.roleTitle?.toLowerCase() === 'agent');
                agents.forEach((agent) => {
                    // Check if already exists to avoid duplicates
                    if (!this.filterOption.find((op) => op.code === agent.userId)) {
                        this.filterOption.push({
                            name: agent.username,
                            code: agent.userId,
                        });
                    }
                });
            });
        }

        this.filterDate = [
            { name: this.translate.instant('filter.pleaseSelectDate'), type: '' },
            { name: this.translate.instant('filter.today'), type: 'toDay' },
            { name: this.translate.instant('filter.thisWeek'), type: 'thisWeek' },
            { name: this.translate.instant('filter.thisMonth'), type: 'thisMonth' },
            { name: this.translate.instant('filter.customDate'), type: 'custom' },
        ];

        if (!this.filterDateType && this.filterDate.length > 0) {
            this.filterDateType = this.filterDate[0].type;
        }
    }
}
