import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import * as XLSX from 'xlsx';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import Swal from 'sweetalert2';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
declare var bootstrap: any;

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
    contacts!: any;
    spareContacts!: any;
    selectedContacts: any = [];
    valueSearch!: string;
    valueSearchForm!: string;
    checkedValues: string[] = [];
    surveyForms!: any;
    spareSurveyForms!: any;

    filterOption!: any[];
    selectedFilter: any | undefined;
    selectedContact: any | undefined;
    selectedFilterForm: any | undefined;

    fileType: string = config.file.type;

    faPenToSquare = faPenToSquare;
    faTrashCan = faTrashCan;
    faArrowRight = faArrowRight;
    faArrowLeft = faArrowLeft;
    faCircleXmark = faCircleXmark;
    faEye = faEye;
    faClipboard = faClipboard;

    pageSizeOptions = [15, 50, 100];
    pageSize = 15;
    currentPage = 1;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

    pageSizeOptionsForm = [5, 10, 20];
    pageSizeForm = 5;
    currentPageForm = 1;
    totalItemsForm = 0;
    totalPagesForm = 0;
    pagesToShowForm = 3;

    visibleRightSideBar: boolean = false;
    visibleLeftSideBar: boolean = false;
    contactShowing: boolean = false;
    FormShowing: boolean = false;
    sidebarShowing: boolean = false;
    detailItem: any = undefined;
    emptyItem: String = 'ว่าง';
    itemIdex: number = 0;
    sideBarItemIndex: number = 0;

    sortId: string = 'startTime';
    sortOrder: string = 'DESC';
    sortIcon: string = '';

    sortIdForm: string = 'createdAt';
    sortOrderForm: string = 'DESC';
    sortIconForm: string = '';

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userRole: string = '';
    userId: string = '';
    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;
    url: string = '';

    invalid = 0;
    AllEmail!: any[];
    availableEmail: any[] = [];

    constructor(
        private router: Router,
        private contactsService: ContactsService,
        private surveyFormService: SurveyFormService,
        private activeRoute: ActivatedRoute,
        private sweetalertServices: SweetAlertService,
        private clipboard: Clipboard,
        private auditLogService: AuditLogService,
    ) {}

    ngOnInit() {
        this.userRole = this.userData.role.roleTitle.toLocaleLowerCase();
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: this.userData.userId },
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

        this.selectedFilterForm = this.filterOption[0].code;
        if (this.selectedFilterForm !== 'all') {
            this.userId = this.userData.userId;
        }
        this.getContacts((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();

        this.getForm((this.currentPageForm - 1) * this.pageSizeForm, this.pageSizeForm);
        this.getFormPage();
    }

    checkRole(): boolean {
        return true;
    }

    updateCheckedValues(contactId: string, Email: string): void {
        if (Email) {
            if (this.checkedValues.includes(contactId)) {
                this.checkedValues = this.checkedValues.filter((id) => id !== contactId);
            } else {
                this.checkedValues.push(contactId);
            }
        } else if (!Email) {
            if (this.checkedValues.includes(contactId)) {
                this.checkedValues = this.checkedValues.filter((id) => id !== contactId);
                this.invalid--;
            } else {
                this.checkedValues.push(contactId);
                this.invalid++;
            }
        }

        if (this.invalid > 0) {
            this.sidebarShowing = false;
        } else {
            this.sidebarShowing = true;
        }
    }

    checkAll(ev: any) {
        this.contacts.forEach((x: any) => {
            x.state = ev.target.checked;
            if (ev.target.checked) {
                this.checkedValues.push(x.contactId);
                if (!x.email) this.invalid++;
            } else {
                this.checkedValues = [];
                this.invalid = 0;
            }
        });

        if (this.invalid > 0) {
            this.sidebarShowing = false;
        } else {
            this.sidebarShowing = true;
        }
    }

    isAllChecked() {
        return this.contacts && this.contacts.every((_: any) => _.state);
    }

    async getContacts(page: number, pageSize: number) {
        await this.contactsService
            .getContactsByPage(page, pageSize, `${this.sortId},${this.sortOrder}`, this.valueSearch, this.selectedFilter)
            .subscribe((res: any) => {
                this.contacts = res;
                this.spareContacts = res;
                console.log('contacts', this.contacts);
            });
    }

    async getContactsSideBar(page: number, pageSize: number, value: string) {
        await this.contactsService
            .getContactsByPage(page, pageSize, `${this.sortId},${this.sortOrder}`, this.valueSearch, this.selectedFilter)
            .subscribe((res: any) => {
                this.contacts = res;
            })
            .add(() => {
                if (value == 'right') this.showSideBar(0, this.contacts[0].contactId);
                else if (value == 'left') this.showSideBar(this.pageSize - 1, this.contacts[this.pageSize - 1].contactId);
            });
    }

    async getPage() {
        await this.contactsService.countContacts(this.valueSearch, this.userId).subscribe((res: any) => {
            this.totalItems = res.count;
        });
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
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                await this.getContacts((this.currentPage - 1) * this.pageSize, this.pageSize);
                this.checkedValues = [];
            }
        }
    }

    pageChangeSideBar(page: number, value: string): void {
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.getContactsSideBar((this.currentPage - 1) * this.pageSize, this.pageSize, value);
            }
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.getContacts((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    showSideBar(value: number, itemId: string) {
        this.sidebarShowing = true;
        this.itemIdex = value;
        this.detailItem = this.contacts.find((contact: any) => contact.contactId == itemId);
        this.sideBarItemIndex = this.contacts.findIndex((contact: any) => contact.contactId == itemId);
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.contactShowing = true;
        this.FormShowing = false;
        if (this.itemIdex == 0 && this.currentPage == 1) this.visibleLeftSideBar = false;
        if (this.itemIdex == this.contacts.length - 1) this.visibleRightSideBar = false;
        if (this.itemIdex == this.contacts.length - 1 && this.currentPage == this.totalPages) this.visibleRightSideBar = false;
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
        this.getContacts((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    async changeSideBar(value: string) {
        if (value == 'right') {
            if (this.itemIdex >= this.pageSize - 1) {
                await this.pageChangeSideBar(this.currentPage + 1, value);
            } else {
                if (this.itemIdex != this.contacts.length - 1) {
                    this.showSideBar(this.itemIdex + 1, this.contacts[this.sideBarItemIndex + 1].contactId);
                }
            }
        } else if (value == 'left') {
            if (this.itemIdex == 0) {
                await this.pageChangeSideBar(this.currentPage - 1, value);
            } else {
                this.showSideBar(this.itemIdex - 1, this.contacts[this.sideBarItemIndex - 1].contactId);
            }
        }
    }

    edit(item: any) {
        this.router.navigate(['/contacts/edit'], { queryParams: { key: item.contactId } });
    }

    deletecontacts(contactId: string) {
        Swal.fire({
            icon: 'warning',
            title: 'Do you want to delete this contact?',
            showCancelButton: true,
            confirmButtonColor: '#3066be',
            cancelButtonColor: '#ec5365',
            width: '50%',
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    body: [contactId],
                };
                this.contactsService
                    .deleteContacts(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'Delete data success.', '', false, '');
                            this.auditLogService.log('', 'Contact', 'Delete Contact', `Contact ID : ${contactId}`, `Success`);
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact',
                                'Delete Contact',
                                `Contact ID : ${contactId}`,
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            }
        });
    }

    deleteSelectcontacts() {
        Swal.fire({
            icon: 'warning',
            title: 'Do you want to delete this contact?',
            showCancelButton: true,
            confirmButtonColor: '#3066be',
            cancelButtonColor: '#ec5365',
            width: '50%',
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    body: this.checkedValues,
                };
                this.contactsService
                    .deleteContacts(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'Delete data success.', '', false, '');
                            this.auditLogService.log(
                                '',
                                'Contact',
                                'Delete Contact',
                                `Contact ID : ${this.checkedValues.join(', ')}`,
                                `Success`,
                            );
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact',
                                'Delete Contact',
                                `Contact ID : ${this.checkedValues.join(', ')}`,
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            }
        });
    }

    sendEmailSideBar() {
        this.contactsService.checkEmail(this.checkedValues).subscribe((res: any) => {
            if (res.length > 0) {
                this.sidebarShowing = false;
                this.sweetalertServices.getSwal('warning', `ผู้ใช้ ${res} ไม่ได้ลงทะเบียนอีเมล์`, '', false, '');
            } else {
                this.visibleLeftSideBar = false;
                this.visibleRightSideBar = false;
                this.contactShowing = false;
                this.FormShowing = true;
            }
        });
    }

    async sendEmail(formID: string, surveyName: string) {
        const userData = localStorage.getItem('userData');
        let userId = '';
        if (userData) {
            userId = JSON.parse(userData).userId;
        }

        const res: any = await this.contactsService.getEmail(this.checkedValues).toPromise();
        this.AllEmail = res;

        const emailList = this.AllEmail.map((e: any) => e.email).join('<br>');

        const result = await Swal.fire({
            icon: 'question',
            title: 'Do you want to send this survey?',
            html: `<p>The following emails will receive this survey:</p><div style="max-height:200px; overflow-y:auto;">${emailList}</div>`,
            showCancelButton: true,
            showDenyButton: this.checkedValues.length === 1,
            confirmButtonText: 'Send',
            denyButtonText: 'Edit Emails',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3066be',
            denyButtonColor: '#f0ad4e',
            cancelButtonColor: '#ec5365',
            width: '50%',
        });

        if (result.isConfirmed) {
            this.availableEmail = [];
            for (const value of this.AllEmail) {
                const data = { email: value.email, contactId: value.contactId, formId: formID, userId: userId };
                const check: any = await this.contactsService.checkEmailSend(data).toPromise();
                if (check.email) {
                    this.availableEmail.push(check);
                }
            }

            if (this.availableEmail.length > 0) {
                for (const value of this.availableEmail) {
                    const data = { email: value.email, id: value.contactId, form: formID, userId: userId, surveyName };
                    const res: any = await this.contactsService.sendEmail(data).toPromise();
                    console.log('res', res);
                }
            }

            this.sweetalertServices.getSwal('success', 'Send Survey success.', '', false, '');
            const offcanvasElement = document.getElementById('offcanvasRight');
            if (offcanvasElement) {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (bsOffcanvas) {
                    bsOffcanvas.hide(); // close sidebar
                }
            }
        } else if (result.isDenied && this.checkedValues.length === 1) {
            this.edit({ contactId: this.checkedValues[0] });
        }
    }

    contactsManage() {
        this.router.navigate(['/contacts/new']);
    }

    search() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getContacts((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    searchForm() {
        if (this.selectedFilterForm !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getForm((this.currentPageForm - 1) * this.pageSizeForm, this.pageSizeForm);
        this.getFormPage();
    }

    async getFormPage() {
        await this.surveyFormService.countSurveyForm(this.valueSearchForm, this.userId).subscribe((res: any) => {
            this.totalItemsForm = res.count;
        });
    }

    async getForm(page: number, pageSize: number) {
        await this.surveyFormService
            .getSurveyFormByPage(page, pageSize, `${this.sortIdForm},${this.sortOrderForm}`, this.valueSearchForm, this.selectedFilterForm)
            .subscribe((res: any) => {
                console.log('res', res);
                this.surveyForms = res;
                this.spareSurveyForms = res;
            });
    }

    async pageChangeForm(page: number) {
        if (page != this.currentPageForm) {
            if (page >= 1 && page <= this.totalPagesForm) {
                this.currentPageForm = page;
                await this.getForm((this.currentPageForm - 1) * this.pageSizeForm, this.pageSizeForm);
            }
        }
    }

    sortForm(value: string) {
        if (this.sortIdForm == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrder = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrder = 'ASC';
            }
        } else {
            this.sortIdForm = value;
        }
        this.getForm((this.currentPageForm - 1) * this.pageSizeForm, this.pageSizeForm);
    }

    pageSizeChangeForm() {
        this.currentPageForm = 1;
        this.getForm((this.currentPageForm - 1) * this.pageSizeForm, this.pageSizeForm);
    }

    get pagesForm(): number[] {
        var pageForm: number[] = [];
        this.totalPagesForm = Math.ceil(this.totalItemsForm / this.pageSizeForm);
        for (var i = -this.pagesToShowForm; i <= this.pagesToShowForm; i++) {
            if (this.currentPageForm + i > 0 && this.currentPageForm + i <= this.totalPagesForm) {
                pageForm.push(this.currentPageForm + i);
            }
        }
        return pageForm;
    }
}
