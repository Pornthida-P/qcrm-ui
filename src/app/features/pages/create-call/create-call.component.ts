import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CallService } from 'src/app/services/call/call.service';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
@Component({
    selector: 'app-create-call',
    templateUrl: './create-call.component.html',
    styleUrl: './create-call.component.scss',
})
export class CreateCallComponent {
    selectedDate: Date;
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
    timepickStart: any;
    hour: any;
    solutions: string = '';
    contactOrgName: string = '';

    selectedItem: any;
    selectedData: any[] = [];
    detailItem: any;
    combinedDateTimeStart: string = '';
    combinedDateTimeEnd: string = '';
    contactOrg: any;
    selectedTopics: any;
    selectedCasesubject: any;
    selectedCaseTopics: any;
    selectedChannels: any;

    parent: any = null;

    model: any;
    organizationName: string | undefined;

    myForm: FormGroup | any; //
    channels: any;

    visibleRightSideBar: boolean = true;
    visibleLeftSideBar: boolean = true;
    FormShowing: boolean = false;
    SearchFormShowing: boolean = true;
    SearchOrgShowing: boolean = false;
    AddOrgShowing: boolean = false;
    thanks: boolean = false;

    pageSizeOptionOrgs = [5, 10, 20];
    currentPage = 1;
    currentPageOrg = 1;
    totalItemOrgs = 0;
    totalPageOrgs = 0;
    pagesToShowOrg = 3;

    pageSizeOptions = [5, 10, 20];
    pageSizeOrg = 5;
    pageSize = 5;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

    sortIdOrg: string = 'createdAt';
    sortOrderOrg: string = 'DESC';

    valueSearch!: string;

    valueSearchOrg!: string;
    selectedFilter: any | undefined;
    spareorganizations!: any;

    sortIcon: string = '';

    contactProductType: string = '';
    checkedValueOrgs: string[] = [];

    faCircleXmark = faCircleXmark;
    sparecontacts: any;

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userId: any;
    activitiestype: any;
    isEmailSubscribed: number = 0;
    contactIdSelect: string = '';
  activityTypeId: any;

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private callServive: CallService,
        private sweetalertServices: SweetAlertService,
        private contactService: ContactsService,
    ) {
        this.selectedDate = new Date();
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

    formatStartDate() {
        const startDate = new Date(this.startTime);

        const formattedStartDate = startDate.toISOString().split('T')[0];

        this.startTime = formattedStartDate;
    }

    formatEndDate() {
        const endDate = new Date(this.endTime);

        const formattedEndDate = endDate.toISOString().split('T')[0];

        this.endTime = formattedEndDate;
    }

    formatTimepickStart() {
        const startTimepick = new Date(this.timepickStart);
        const formatTimepickStart = startTimepick.toISOString();
        this.timepickStart = formatTimepickStart;
    }

    onTimepickStartChange(event: any) {
        const hour = event.hour;
        const minute = event.minute;
        const second = event.second;

        this.timepickStart = event;

        const formattedTimeStartPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
            .toString()
            .padStart(2, '0')}`;

        this.combinedDateTimeStart = `${this.startTime} ${formattedTimeStartPick}`;
    }

    onTimepickEndChange(event: any) {
        const hour = event.hour;
        const minute = event.minute;
        const second = event.second;

        this.timepickEnd = event;

        const formattedTimeEndPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
            .toString()
            .padStart(2, '0')}`;

        this.combinedDateTimeEnd = `${this.endTime} ${formattedTimeEndPick}`;
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params: any) => {
            this.contactId = params['contactId'];
        });

        this.callServive.getCaseTopic().subscribe((casetopics: any) => {
            this.casetopics = casetopics;
        });

        this.callServive.getOrganizations().subscribe((organizations: any) => {
            this.organizations = organizations;
        });

        this.callServive.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestype = activitiestype;
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
            console.log('user: ', this.userData.userId);
        }

        this.getFormContact((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
    }

    submit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const data = {
            contactId: this.contactId,
            name: this.contactIdSelect,
            organization: this.contactOrg,
            caseTopicId: this.selectedCaseTopics,
            caseSubject: this.selectedCasesubject,
            channel: this.selectedChannels,
            emailInfo: this.isEmailSubscribed,
            activityType: this.activityTypeId,
            description: this.description,
            startTime: this.combinedDateTimeStart,
            solution: this.solutions,
            createdById: userData.userId,
        };
        this.callServive
            .createCalls(data)
            .pipe(
                tap((res) => {
                    this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '/contacts');
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }
    showSideBarOrg() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = true;
        this.SearchOrgShowing = true;
        this.thanks = false;
        this.AddOrgShowing = false;
    }

    pageSizeChangeOrg() {
        this.currentPage = 1;
        this.getFormContact((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
    }

    async getFormContact(pageOrg: number, pageSizeOrg: number) {
        await this.callServive
            .getContactByPage(pageOrg, pageSizeOrg, `${this.sortIdOrg},${this.sortOrderOrg}`, this.valueSearchOrg, this.selectedFilter)
            .subscribe((res: any) => {
                this.contacts = res;
                this.sparecontacts = res;
                console.log('contact:', this.contacts);
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
        this.getFormContact((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
    }

    chooseContact(contactsId: string) {
        this.contactIdSelect = contactsId;
        this.callServive.getContactById(contactsId).subscribe((res: any) => {
            this.contactName = `${res[0].firstName} ${res[0].lastName}`;
        });
    }

    async pageChangeOrg(pageOrg: number) {
        if (pageOrg != this.currentPageOrg) {
            if (pageOrg >= 1 && pageOrg <= this.totalPageOrgs) {
                this.currentPageOrg = pageOrg;
                await this.getFormContact((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
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

    searchOrg() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getFormContact((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
    }

    async getPageOrg() {
        await this.callServive.countContact(this.valueSearchOrg, this.userId).subscribe((res: any) => {
            this.totalItemOrgs = res.count;
        });
    }

    onCheckboxChange(event: any, activityTypeId: number) {
        if (event.target.checked) {
            console.log('Selected activity type ID:', activityTypeId);
        }
    }

    toggleEmailSubscription(event: any) {
        this.isEmailSubscribed = event.target.checked ? 1 : 0;
        console.log('email:', this.isEmailSubscribed);
    }
}
