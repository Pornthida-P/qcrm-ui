import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import Swal from 'sweetalert2';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'contactSearchFilter',
})
export class ContactSearchFilterPipe implements PipeTransform {
    transform(value: any, args: any, filter: any): any {
        if (!value) return [];
        const searchTerm = args && args.toString().toLocaleLowerCase();
        return value.filter((val: any) => {
            if (filter === 'all') {
                if (!searchTerm) return true;
                return Object.values(val).some(
                    (field) => field && field.toString().toLocaleLowerCase().includes(searchTerm),
                );
            }
            return Object.values(val).some(
                (field) => field && field.toString().toLocaleLowerCase().includes(filter),
            );
        });
    }
}

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
    contacts!: any;
    valueSearch!: string;

    filterOption!: any[];
    selectedFilter: any | undefined;

    pageSizeOptions = [15, 50, 100];
    pageSize = 15;
    currentPage = 1;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

    sortId: string = 'startTime';
    sortOrder: string = 'DESC';
    sortIcon: string = '';

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userId: string = '';

    constructor(
        private router: Router,
        private contactsService: ContactsService,
        private activeRoute: ActivatedRoute,
        private sweetalertServices: SweetAlertService,
        private auditLogService: AuditLogService,
        private translate: TranslateService,
    ) {}

    ngOnInit() {
        this.filterOption = [
            { name: this.translate.instant('filter.all'), code: 'all' },
            { name: this.translate.instant('filter.onlyMy'), code: this.userData.userId },
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
        return true;
    }

    async getContacts(page: number, pageSize: number) {
        await this.contactsService
            .getContactsByPage(page, pageSize, `${this.sortId},${this.sortOrder}`, this.valueSearch, this.selectedFilter)
            .subscribe((res: any) => {
                this.contacts = res;
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
            }
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.getContacts((this.currentPage - 1) * this.pageSize, this.pageSize);
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

    edit(item: any) {
        this.router.navigate(['/contacts/edit'], { queryParams: { key: item.contactId } });
    }

    deletecontacts(contactId: string) {
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
                const data = {
                    body: [contactId],
                };
                this.contactsService
                    .deleteContacts(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.success('alert.deleteSuccess');
                            this.auditLogService.log('', 'Contact', contactId, 'Delete Contact', `Contact ID : ${contactId}`, `Success`);
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact',
                                contactId,
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

    contactsManage() {
        this.router.navigate(['/contacts/new']);
    }

    search() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.currentPage = 1;
        this.getContacts((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }
}
