import { Component, OnInit } from '@angular/core';
import { CallService } from 'src/app/services/call/call.service';
import * as moment from 'moment';
import { User } from 'src/app/shared/interface/user.interface';
import { UserService } from 'src/app/services/user/user.service';
import { ContactsService } from 'src/app/services/contacts/contacts.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    cases: any[] = [];
    filteredCases: any[] = [];
    searchText: string = '';
    selectedStatus: string = '';
    userData: User | null = null;
    pageSizeOptions = [15, 50, 100];
    pageSize = 15;
    currentPage = 1;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;
    contactCount = 0;
    createdById = '';
    interestedCount = 0;
    notInterestedCount = 0;
    contactedCount = 0;
    private searchTimeout: any;

    constructor(private callService: CallService, private userService: UserService, private contactService: ContactsService) {}

    ngOnInit(): void {
        this.getDataUser();
        this.getContactCount();
    }

    getDataUser() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.createdById = res?.role.roleTitle.toLowerCase() === 'super admin' ? 'all' : res?.username ?? '';
            if (this.createdById) {
                this.loadTodayCases(0, this.pageSize);
            }
        });
    }

    loadTodayCases(page: number, pageSize: number): void {
        const sortId = 'createdAt,DESC';
        const searchTextParam = this.searchText && this.searchText.trim() ? this.searchText.trim() : 'undefined';
        const dateFilterType = 'toDay';
        const startDate = '';
        const endDate = '';

        this.callService
            .getCallsPage(page, pageSize, sortId, searchTextParam, this.createdById, dateFilterType, startDate, endDate)
            .subscribe({
                next: (response: any) => {
                    let data = response;
                    if (typeof response === 'string') {
                        data = JSON.parse(response);
                    }
                    if (Array.isArray(data)) {
                        this.cases = data.map((item: any) => ({
                            ...item,
                            type:
                                item.type === 'I'
                                    ? 'I'
                                    : item.type === 'O'
                                    ? 'O'
                                    : item.type === 'Inbound'
                                    ? 'I'
                                    : item.type === 'Outbound'
                                    ? 'O'
                                    : item.type,
                        }));
                    } else if (data && Array.isArray(data.data)) {
                        this.cases = data.data.map((item: any) => ({
                            ...item,
                            type:
                                item.type === 'I'
                                    ? 'I'
                                    : item.type === 'O'
                                    ? 'O'
                                    : item.type === 'Inbound'
                                    ? 'I'
                                    : item.type === 'Outbound'
                                    ? 'O'
                                    : item.type,
                        }));
                    }
                    this.filterCases();
                },
                error: (error) => {
                    console.error('Error loading cases:', error);
                },
            });
    }

    filterCases(): void {
        this.filteredCases = this.cases.filter((caseItem) => {
            const matchesStatus =
                !this.selectedStatus ||
                caseItem.type === this.selectedStatus ||
                (this.selectedStatus === 'I' && caseItem.type === 'Inbound') ||
                (this.selectedStatus === 'O' && caseItem.type === 'Outbound');

            return matchesStatus;
        });
    }

    isOverOneDay(createdAt: string): boolean {
        if (!createdAt) return false;
        const createdDate = moment(createdAt);
        const now = moment();
        const hoursDiff = now.diff(createdDate, 'hours');
        return hoursDiff > 24; // เกิน 24 ชั่วโมง (1 วัน)
    }

    async pageChange(page: number) {
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                await this.loadTodayCases((this.currentPage - 1) * this.pageSize, this.pageSize);
            }
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.loadTodayCases((this.currentPage - 1) * this.pageSize, this.pageSize);
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

    getContactCount() {
        this.contactService.countContacts(this.searchText, this.createdById == 'all' ? '' : this.createdById).subscribe((res: any) => {
            this.contactCount = res.count;
        });
    }

    onSearchInput(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.currentPage = 1;
            this.loadTodayCases(0, this.pageSize);
        }, 300);
    }
}
