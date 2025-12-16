import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-call-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './call-list.component.html',
    styleUrl: './call-list.component.scss',
})
export class CallListComponent implements OnInit {
    currentPage = 1;
    totalPages = 1;
    pageSize = 15;
    pageSizeOptions = [10, 15, 20, 25, 50, 100];
    caseList: any[] = [];
    caseListByUserId: any[] = [];
    pages: number[] = [];
    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userId: string = '';
    statusList: any[] = [];

    constructor(private callListService: CallListService, private router: Router) {}

    ngOnInit(): void {
        this.calculatePages();
        // this.getAllCaseList();
        // localStorage.setItem('userData', JSON.stringify(this.userData));
        if (this.userData.role.roleTitle.toLowerCase() === 'super admin' || this.userData.role.roleTitle.toLowerCase() === 'admin') {
            this.getCaseListByUserId('all');
        } else {
            this.getCaseListByUserId(this.userData.userId);
        }
    }

    pageChange(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.calculatePages();
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.calculatePages();
    }

    calculatePages() {
        this.totalPages = Math.ceil(this.caseListByUserId.length / this.pageSize) || 1;
        this.pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            this.pages.push(i);
        }
    }

    get paginatedCalls(): any[] {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.caseListByUserId.slice(start, end);
    }

    getAllCaseList() {
        this.callListService.getAllCallList().subscribe((res: any) => {
            this.caseList = res;
            this.calculatePages();
            console.log(this.caseList);
        });
    }

    getCaseListByUserId(userId: string) {
        this.callListService.getCaseListByUserId(userId).subscribe((res: any) => {
            console.log(res);
            this.caseListByUserId = res.sort((a: any, b: any) => {
              const aHasCallStatus = a.callStatusId !== null && a.callStatusId !== undefined;
              const bHasCallStatus = b.callStatusId !== null && b.callStatusId !== undefined;

              if (aHasCallStatus === bHasCallStatus) {
                  const aTime = a.callStatusChangedAt || a.requestDateTime;
                  const bTime = b.callStatusChangedAt || b.requestDateTime;
                  return new Date(aTime).getTime() - new Date(bTime).getTime();
                }

              return aHasCallStatus ? 1 : -1;
          });
            this.calculatePages();
        });
        console.log(this.caseListByUserId);
    }

    clickCall(caseId: string, contactId: string) {
        console.log('Click Call:', caseId, contactId);
        this.router.navigate(['/contacts/edit'], { queryParams: { caseId: caseId, key: contactId } });
    }

    getStatusList() {
        this.callListService.getStatusList().subscribe((res: any) => {
            this.statusList = res;
            console.log(this.statusList);
        });
    }
}
