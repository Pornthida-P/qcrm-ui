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

    inbound = 'Inbound';
    outbound = 'Outbound';

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
    selectedCaseTopics: any[] = [];
    selectedChannels: any;
    channels: any;
    isEmailSubscribed: number = 0;
    activitiestype: any;
    timepickStart: { hour: number; minute: number; second: number } = { hour: 0, minute: 0, second: 0 };
    activityTypeId: any;
    newDateTime: any;
    startTime: string = '';
    solutions: string = '';
    description: string = '';
    combinedDateTimeStart: string = '';
    combinedDateTimeEnd: string = '';

    numberArray = [1, 2, 3, 4, 5];
    selectSubject = 1;

    selectedActivityTopicIdSmn: string[] = [];
    selectedActivitiesSmn: any;
    selectedActivities: any;

    selectedActivityTopicId: string[] = [];
    searchContactShowing: boolean = false;

    selectedCallTypeId: string = '';
    activityTypeById: any;
    activitiesTopic: any;
    selectedActivitiesElearning: any;
    selectedCheckboxIds: any;
    valueSearchSmn!: string;

    activitySmn: any;
    activityEln: any;

    SearchElearningShowing: boolean = false;
    valueSearchEln!: string;
    activitiestypeEln: any;

    pageSizeOptionOrgs = [5, 10, 20];
    pageSizeOrg = 5;
    currentPageOrg = 1;
    totalItemOrgs = 0;
    totalPageOrgs = 0;
    pagesToShowOrg = 3;

    sortIdOrg: string = 'createdAt';
    sortOrderOrg: string = 'DESC';

    SearchFormShowing: boolean = true;
    SearchOrgShowing: boolean = false;

    organizations!: any;
    spareorganizations!: any;
    valueSearchOrg!: string;

    AddOrgShowing: boolean = false;
    AddCallShowing: boolean = false;

    casetopics: any[] = [];
    casesubjects: any[] = [];
    callTypes: any;

    isCheckboxSelected: { [key: number]: boolean } = {};

    inputActivity: string = '';
    inputActivity_2: string = '';

    showActivitySeminarSideBar: boolean = false;
    showActivityElearningSideBar: boolean = false;

    nameActivityTopic: string = '';
    selectedActivityTopicName: any;
    activitiestypeTopic: any;
    SearchSmnShowing: boolean = false;
    sortIdSmn: string = 'createdAt';
    sortOrderSmn: string = 'DESC';
    checkedValueSmns: string[] = [];
    AddSmnShowing: boolean = false;

    sortIdEln: string = 'createdAt';
    sortOrderEln: string = 'DESC';
    checkedValueEln: string[] = [];
    AddElnShowing: boolean = false;
    FormShowing: boolean = false;

    thanks: boolean = false;

    industryType: any[] = [];
    productTypes: any[] = [];

    contactOrg: string = '';
    contactOrgName: string = '';

    contactProductType: string = '';
    checkedValueOrgs: string[] = [];
    AddContactShowing: boolean = false;

    showOrgSidebar: boolean = false;
    showContactSidebar: boolean = false;

    attachments: Attachment[] = [];
    attachmentsId: string[] | undefined;

    contactId: string = '';
    phoneCall: string = '';

    selectedContactNumber: { contactNumber: string; contactNumberId: string } | null = null;
    contactNumber: any;
    selectedEmail: any[] = [];
    email: any;
    emails: any;

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
    ) {
        this.startTime = this.formatDate(new Date());
    }

    ngOnInit() {
        this.getUserData();

        this.userRole = this.userData.role.roleTitle.toLocaleLowerCase();
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'เฉพาะฉัน', code: this.userData.username },
        ];

        this.filterDate = [
            { name: 'กรุณาเลือกวันที่', type: '' },
            { name: 'วันนี้', type: 'toDay' },
            { name: 'อาทิตย์นี้', type: 'thisWeek' },
            { name: 'เดือนนี้', type: 'thisMonth' },
            { name: 'เลือกวันที่', type: 'custom' },
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
            this.getCallsData((this.currentPage - 1) * this.currentPage, this.pageSize);
            this.getPage();
        });

        this.dateRangeForm.get('endDate')!.valueChanges.subscribe((value) => {
            this.endDate = moment(value).format('YYYY-MM-DD');
            this.getCallsData((this.currentPage - 1) * this.currentPage, this.pageSize);
            this.getPage();
        });

        this.callTypes = [
            { id: '1', name: this.inbound },
            { id: '2', name: this.outbound },
        ];
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
            .getCallsPage(
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
            this.selectedCalls = this.calls.filter((calls: any) => this.selectValue.includes(calls.callId));
        } else {
            this.selectedCalls = [];
        }

        if (this.selectedCalls.length != 0) {
            const processedForms = this.selectedCalls.reduce(
                (acc: any, cur: any) => [
                    ...acc,
                    {
                        createdAt: cur.createdAt,
                        name: cur.caller,
                        direction: cur.type,
                        caseTopicName: cur.casesub,
                        description: cur.description,
                        solution: cur.solution,
                        username: cur.agent,
                    },
                ],
                [],
            );

            const columns = [['เวลา', 'เบอร์โทร', 'ประเภทสาย', 'เรื่องที่ติดต่อ', 'รายละเอียด', 'แนวทางการแก้ไข', 'ผู้ที่รับผิดชอบ']];
            const wb = XLSX.utils.book_new();
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws, columns);

            XLSX.utils.sheet_add_json(ws, processedForms, { origin: 'A2', skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            XLSX.writeFile(wb, `ประวัติการโทร${this.fileType}`);
        }
    }

    selectCheckbox(callId: number): void {
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
                this.selectValue.push(x.callId);
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
        this.AddOrgShowing = false;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.thanks = false;
        this.SearchOrgShowing = false;
        this.AddCallShowing = true;
        this.showActivitySeminarSideBar = false;
        this.showActivityElearningSideBar = false;

        this.callService.getCaseTopic().subscribe((casetopics: any) => {
            this.casetopics = casetopics;
        });

        this.callService.getAllCaseSubjects().subscribe((casesubjects: any) => {
            this.casesubjects = casesubjects;
        });

        this.callService.getAllChannels().subscribe((channels: any) => {
            this.channels = channels;
        });

        this.callService.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestype = activitiestype.filter((activityType: any) => [1, 43].includes(parseInt(activityType.activityTypeId)));
        });
    }

    editCall(callId: string, type: string, contactId: string) {
        console.log('contactIdEdit: ', contactId);
        this.attachmentShowing = false;
        console.log('Edit Call:', callId);
        console.log('Type:', type);
        this.cType = '';
        this.callId = '';
        this.selectedCasesubject = '';
        this.selectedChannels = '';
        this.isEmailSubscribed = 0;
        this.activityTypeId = '';
        this.startTime = '';
        this.description = '';
        this.solutions = '';
        this.selectedCallTypeId = '';
        const date = new Date('');
        this.timepickStart = {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
        };
        this.selectedCaseTopics = [];
        this.selectedCasesubject = [];
        this.selectedActivityTopicIdSmn = [];
        this.selectedActivitiesSmn = [];
        this.selectedActivityTopicId = [];
        this.callService.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
            this.saveSelectedActivitiesSmn();
        });
        this.callService.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
            this.saveSelectedActivities();
        });

        if (type === 'call') {
            this.callService.getCallById(callId).subscribe((call: any) => {
                console.log('Call:', call);
                this.cType = 'call';
                this.callId = call[0].callId;
                this.selectedCasesubject = [];
                this.selectedChannels = call[0].channel;
                this.isEmailSubscribed = call[0].emailInfo;
                this.activityTypeId = call[0].activityType;
                this.selectedCallTypeId = call[0].operationType;
                this.startTime = call[0].startTime;
                this.description = call[0].description;
                this.solutions = call[0].solution;
                this.selectedCallTypeId = call[0].operationType;
                const date = new Date(call[0].startTime);
                this.timepickStart = {
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    second: date.getSeconds(),
                };
              this.selectedEmail = call[0].email;
              this.selectedContactNumber = call[0].caller_id

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

                // Handle selectedActivityTopicIdSmnr
                if (call[0].activitySmn && call[0].activitySmn !== 'null') {
                    let selectedActivityTopicIdSmnr = call[0].activitySmn;
                    if (!Array.isArray(selectedActivityTopicIdSmnr)) {
                        selectedActivityTopicIdSmnr = JSON.parse(selectedActivityTopicIdSmnr);
                    }
                    this.selectedActivityTopicIdSmn = selectedActivityTopicIdSmnr.map(String);

                    this.callService.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
                        this.activitySmn = activitySmn;
                        this.saveSelectedActivitiesSmn();
                    });
                }

                // Handle selectedActivitiesEl
                if (call[0].activityEln && call[0].activityEln !== 'null') {
                    let selectedActivityTopicIds = call[0].activityEln;
                    if (!Array.isArray(selectedActivityTopicIds)) {
                        selectedActivityTopicIds = JSON.parse(selectedActivityTopicIds);
                    }
                    this.selectedActivityTopicId = selectedActivityTopicIds.map(String);
                    // Fetch and filter activitiestypeTopic
                    this.callService.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
                        this.activityEln = activityEln;
                        this.saveSelectedActivities();
                    });
                }
            });
        } else if (type === 'case') {
            this.callService.getCaseById(callId).subscribe((call: any) => {
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
              this.selectedCallTypeId = call.operationType;
              this.selectedEmail = call.email;
              this.selectedContactNumber = call.contactNumber

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

                if (call.activitySmn && call.activitySmn !== 'null') {
                    let selectedActivityTopicIdSmnr = call.activitySmn;
                    if (!Array.isArray(selectedActivityTopicIdSmnr)) {
                        selectedActivityTopicIdSmnr = JSON.parse(selectedActivityTopicIdSmnr);
                    }
                    this.selectedActivityTopicIdSmn = selectedActivityTopicIdSmnr.map(String);

                    this.callService.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
                        this.activitySmn = activitySmn;
                        this.saveSelectedActivitiesSmn();
                    });
                }

                // Handle selectedActivitiesEl
                if (call.activityEln && call.activityEln !== 'null') {
                    let selectedActivityTopicIds = call.activityEln;
                    if (!Array.isArray(selectedActivityTopicIds)) {
                        selectedActivityTopicIds = JSON.parse(selectedActivityTopicIds);
                    }
                    this.selectedActivityTopicId = selectedActivityTopicIds.map(String);
                    // Fetch and filter activitiestypeTopic
                    this.callService.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
                        this.activityEln = activityEln;
                        this.saveSelectedActivities();
                    });
                }
            });
        }

        // Fetch activitySmn
        this.callService.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
        });

        this.callService.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
        });

        this.showAddCall();
        this.getContactNumber(contactId);
        this.getEmail(contactId);
    }

    saveSelectedActivitiesSmn() {
        this.selectedActivitiesSmn = this.activitySmn.filter((activity: { activityTopicId: string }) => {
            return this.selectedActivityTopicIdSmn.includes(activity.activityTopicId);
        });
        // this.showAddCall();
    }

    toggleActivityTopicIdSmn(activityTopicId: string) {
        const index = this.selectedActivityTopicIdSmn.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedActivityTopicIdSmn.push(activityTopicId);
        } else {
            this.selectedActivityTopicIdSmn.splice(index, 1);
        }
        this.saveSelectedActivitiesSmn();
        console.log('select id activity:', this.selectedActivityTopicIdSmn);
    }

    toggleCheckbox(activityTopicId: number) {
        const index = this.selectedCheckboxIds.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedCheckboxIds.push(activityTopicId);
        } else {
            this.selectedCheckboxIds.splice(index, 1);
        }
    }

    toggleActivityTopicId(activityTopicId: string) {
        const index = this.selectedActivityTopicId.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedActivityTopicId.push(activityTopicId);
        } else {
            this.selectedActivityTopicId.splice(index, 1);
        }
        this.saveSelectedActivities();
        console.log('select id activity:', this.selectedActivityTopicId);
    }

    saveSelectedActivities() {
        this.selectedActivities = this.activityEln.filter((activity: { activityTopicId: string }) => {
            return this.selectedActivityTopicId.includes(activity.activityTopicId);
        });
        // this.showAddCall();
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
        this.callService.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
        });
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

    async getFormEln() {
        await this.callService.getActivityIdByPage(this.valueSearchEln).subscribe((res: any) => {
            console.log('API response:', res);
            this.activityTypeById = res;
            // this.spareActivityTypeById = res;
        });
        console.log('ActivityIdByPage:', this.activityTypeById);
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

    filterActivities(): any[] {
        return this.activitiestype.filter((activityType: { activityTypeId: number }) => [21, 27, 28].includes(activityType.activityTypeId));
    }

    async getFormOrg(pageOrg: number, pageSizeOrg: number) {
        await this.contactsService
            .getOrgByPage(pageOrg, pageSizeOrg, `${this.sortIdOrg},${this.sortOrderOrg}`, this.valueSearchOrg, this.selectedFilter)
            .subscribe((res: any) => {
                this.organizations = res;
                this.spareorganizations = res;
            });
    }

    async getPageOrg() {
        await this.contactsService.countOrg(this.valueSearchOrg, this.userId).subscribe((res: any) => {
            this.totalItemOrgs = res.count;
        });
    }

    showAddOrg() {
        this.AddOrgShowing = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.thanks = false;
        this.SearchOrgShowing = false;
        this.AddCallShowing = false;
        this.contactsService.getAllIndustryType().subscribe((res: any) => {
            this.industryType = res;
        });

        this.contactsService.getAllProductTypes().subscribe((res: any) => {
            this.productTypes = res;
        });
    }

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

    chooseOrg(orgId: string) {
        this.contactOrg = orgId;
        this.contactsService.getOrganizationById(orgId).subscribe((res: any) => {
            this.contactOrgName = res[0].orgName;
            this.contactProductType = res[0].prodName;
        });
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

    pageSizeChangeOrg() {
        this.currentPage = 1;
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
    }

    showSideBarOrg() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.thanks = false;
        this.SearchOrgShowing = true;
        this.AddOrgShowing = false;
        this.AddCallShowing = false;
    }

    toggleEmailSubscription(event: any) {
        this.isEmailSubscribed = event.target.checked ? 1 : 0;
        console.log('email:', this.isEmailSubscribed);
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
        this.AddCallShowing = false;

        this.callService.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestypeTopic = activitiestype.filter((activityType: any) =>
                [21, 27, 28].includes(parseInt(activityType.activityTypeId)),
            );
        });

        this.callService.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
        });
    }

    inputActivityElearning(event: any) {
        console.log(event.target.value);
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
        this.AddCallShowing = false;

        this.callService.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestypeEln = activitiestype.filter((activityType: any) => [43].includes(parseInt(activityType.activityTypeId)));
        });

        this.callService.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
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

    submitCall() {
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
                    call_id: this.phoneCall,
                    operationType: selectedCallTypeId,
                    activitySmn: selectedActivitiesSmnIds,
                    activityEln: selectedActivitiesElnIds,
                };
                console.log('Data: ', data);
                this.callService
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
                    activitySmn: selectedActivitiesSmnIds,
                    activityEln: selectedActivitiesElnIds,
                    call_id: this.selectedContactNumber ? this.selectedContactNumber.contactNumber : null,
                    emails: this.selectedEmail,
                    contactNumberId: this.selectedContactNumber ? this.selectedContactNumber.contactNumberId : null,
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
                    activitySmn: selectedActivitiesSmnIds,
                    activityEln: selectedActivitiesElnIds,
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

    searchSmn(): void {
        this.callService.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
        });
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

                this.callService
                    .createActivityTopic(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                            this.auditLogService.log(
                                '',
                                'Contact Create Call ActivityTopic',
                                'Contact Create Case Call ActivityTopic',
                                `ContactID : ${this.contactId}`,
                                `Success`,
                            );
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Create Call ActivityTopic',
                                'Contact Create ActivityTopic',
                                `ContactID : ${this.contactId}`,
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

    addTopicAndSubject() {
        if (this.selectSubject < 5) this.selectSubject++;
        console.log(this.selectSubject);
    }

    removeTopicAndSubject() {
        if (this.selectSubject > 0) this.selectSubject--;
        console.log(this.selectSubject);
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

    async getEmail(contactsId: string) {
        try {
            const email = (await this.callService.getEmailById(contactsId).toPromise()) as any[];
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
}
