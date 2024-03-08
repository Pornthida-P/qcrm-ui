import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import * as XLSX from 'xlsx';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import Swal from 'sweetalert2';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';

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
    checkedValues: string[] = [];

    filterOption!: any[];
    selectedFilter: any | undefined;
    selectedContact: any | undefined;

    fileType: string = config.file.type;

    faPenToSquare = faPenToSquare;
    faTrashCan = faTrashCan;
    faArrowRight = faArrowRight;
    faArrowLeft = faArrowLeft;
    faCircleXmark = faCircleXmark;
    faEye = faEye;
    faClipboard = faClipboard;

    pageSizeOptions = [10, 20];
    pageSize = 10;
    currentPage = 1;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

    visibleRightSideBar: boolean = true;
    visibleLeftSideBar: boolean = true;
    detailItem: any = undefined;
    emptyItem: String = 'ว่าง';
    itemIdex: number = 0;
    sideBarItemIndex: number = 0;

    sortId: string = 'a.createdAt';
    sortOrder: string = 'DESC';
    sortIcon: string = '';

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userRole: string = '';
    userId: string = '';
    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;
    url: string = '';

    constructor(
        private router: Router,
        private contactsService: ContactsService,
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
        this.getContacts((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    checkRole(): boolean {
        return this.roleCanAccessCUDForm.includes(this.userRole);
    }

    updateCheckedValues(contactId: string): void {
        if (this.checkedValues.includes(contactId)) {
            this.checkedValues = this.checkedValues.filter((id) => id !== contactId);
        } else {
            this.checkedValues.push(contactId);
        }
    }

    checkAll(ev: any) {
        this.contacts.forEach((x: any) => {
            x.state = ev.target.checked;
            if (ev.target.checked) {
                this.checkedValues.push(x.contactId);
            } else {
                this.checkedValues = [];
            }
        });
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
        this.itemIdex = value;
        this.detailItem = this.contacts.find((contact: any) => contact.contactId == itemId);
        this.sideBarItemIndex = this.contacts.findIndex((contact: any) => contact.contactId == itemId);
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
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
        const cb = `${this.pageSize},${this.currentPage},${this.totalItems},${this.totalPages}`;
        this.router.navigate(['/contacts/edit'], { queryParams: { key: item.contactId, cb: cb } });
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
                            this.auditLogService.log('', 'Contact', 'Delete Contact', `Contact ID : ${contactId}`);
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
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
                            this.auditLogService.log('', 'Contact', 'Delete Contact', `Contact ID : ${this.checkedValues.join(', ')}`);
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            throw error;
                        }),
                    )
                    .subscribe();
            }
        });
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
}
