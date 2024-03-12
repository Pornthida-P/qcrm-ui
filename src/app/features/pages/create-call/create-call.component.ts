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
    selectedCaseTopics: any[] = [];
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
    searchContactShowing: boolean = false;
    AddContactShowing: boolean = false;
    thanks: boolean = false;

    pageSizeOptionContact = [5, 10, 20];
    currentPage = 1;
    currentpageContact = 1;
    totalItemContact = 0;
    totalpageContacts = 0;
    pagesToShowContact = 3;

    pageSizeOptions = [5, 10, 20];
    pageSizeContact = 5;
    pageSize = 5;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

    pageSizeOptionOrgs = [5, 10, 20];
    pageSizeOrg = 5;
    currentPageOrg = 1;
    totalItemOrgs = 0;
    totalPageOrgs = 0;
    pagesToShowOrg = 3;

    SearchOrgShowing: boolean = false;
    valueSearchOrg!: string;

    sortIdOrg: string = 'createdAt';
    sortOrderOrg: string = 'DESC';
    checkedValueOrgs: string[] = [];
    AddOrgShowing: boolean = false;

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

    currentPageContact = 1;
    showOrgSidebar: boolean = false;
    showContactSidebar: boolean = false;

    files: File[] = [];
    fileNames: any;
    attachments: Attachment[] = [];
    attachmentsId: string[] | undefined;

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private callServive: CallService,
        private sweetalertServices: SweetAlertService,
        private contactService: ContactsService,
        private ngSelectConfig: NgSelectConfig,
        private attachmentService: AttachmentService,
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

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatStartDate() {
        const startDate = new Date(this.startTime);
        this.startTime = this.formatDate(startDate);
        console.log('startTime: ', this.startTime);
    }

    formatTimepickStart() {
        const startTimepick = new Date(this.timepickStart);
        const formatTimepickStart = startTimepick.toISOString();
        this.combinedDateTimeStart = formatTimepickStart;
    }

    onTimepickStartChange(event: any) {
        if (event) {
            const hour = event.hour;
            const minute = event.minute;
            const second = event.second;

            const formattedTimeStartPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
                .toString()
                .padStart(2, '0')}`;

            this.newDateTime = `${this.formatDate(new Date(this.startTime))} ${formattedTimeStartPick}`;
            console.log('New combined date and time: ', this.newDateTime);
        }
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

        this.getFormContact((this.currentPageContact - 1) * this.pageSizeContact, this.pageSizeContact);
        this.getPageContact();
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
    }

    submit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        console.log('Id File: ', this.attachmentsId);
        const data = {
            contactId: this.contactId,
            name: this.contactIdSelect,
            organization: this.contactOrg,
            caseTopicId: this.selectedCaseTopics,
            caseSubject: this.selectedCasesubject,
            channel: this.selectedChannels,
            emailInfo: this.isEmailSubscribed ? 1 : null,
            activityType: this.activityTypeId,
            description: this.description,
            startTime: this.newDateTime,
            solution: this.solutions,
            createdById: userData.userId,
            attachment: this.attachmentsId,
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
    }

    pageSizeChangeContact() {
        this.currentPage = 1;
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
        if (event.target.checked) {
            this.activityTypeId = activityTypeId;
        }
    }

    toggleEmailSubscription(event: any) {
        this.isEmailSubscribed = event.target.checked ? 1 : 0;
        console.log('email:', this.isEmailSubscribed);
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
    }

    pageSizeChangeOrg() {
        this.currentPage = 1;
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
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
    }

    searchOrg() {
        console.log('Search ORG:');

        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
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
}
