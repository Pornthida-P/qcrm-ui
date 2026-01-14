import { Component, OnInit } from '@angular/core';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { Router } from '@angular/router';
import { StatusService } from 'src/app/services/status/status.service';
@Component({
    selector: 'app-call-list',
    standalone: false,
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

    constructor(private callListService: CallListService, private router: Router, public statusService: StatusService) {}

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
                // ตรวจสอบว่าเป็นเคสเก่า (เมื่อวาน) หรือเคสใหม่ (วันนี้)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const aDate = new Date(a.requestDateTime);
                aDate.setHours(0, 0, 0, 0);
                const bDate = new Date(b.requestDateTime);
                bDate.setHours(0, 0, 0, 0);

                const aIsOld = aDate.getTime() < today.getTime();
                const bIsOld = bDate.getTime() < today.getTime();

                // เรียงลำดับ: เคสเก่าก่อน เคสใหม่หลัง
                if (aIsOld !== bIsOld) {
                    return aIsOld ? -1 : 1;
                }

                // ในกลุ่มเดียวกัน ตรวจสอบว่าโทรไม่รับหรือไม่สะดวกสนทนาหรือไม่
                const aIsNoAnswer =
                    a.callStatus &&
                    (a.callStatus.toLowerCase().includes('ไม่รับ') ||
                        a.callStatus.toLowerCase().includes('no answer') ||
                        a.callStatus.toLowerCase().includes('ไม่สะดวกสนทนา'));
                const bIsNoAnswer =
                    b.callStatus &&
                    (b.callStatus.toLowerCase().includes('ไม่รับ') ||
                        b.callStatus.toLowerCase().includes('no answer') ||
                        b.callStatus.toLowerCase().includes('ไม่สะดวกสนทนา'));

                // เคสที่โทรไม่รับหรือไม่สะดวกสนทนาให้อยู่ด้านล่าง
                if (aIsNoAnswer !== bIsNoAnswer) {
                    return aIsNoAnswer ? 1 : -1;
                }

                // เรียงตาม requestDateTime
                const aTime = new Date(a.requestDateTime).getTime();
                const bTime = new Date(b.requestDateTime).getTime();
                return aTime - bTime;
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

    getCallStatusClass(callStatus: string): string {
        if (!callStatus) return 'status-not-called';
        const status = callStatus.trim().toLowerCase();

        // สีแดง - ไม่รับสาย, ไม่สนทนาต่อ, no answer
        if (status.includes('ไม่รับสาย') || status.includes('ไม่สนทนาต่อ') || status.includes('no answer')) {
            return 'status-no-answer';
        }

        // สีส้ม - ไม่สะดวกสนทนา
        if (status.includes('ไม่สะดวกสนทนา')) {
            return 'status-followup';
        }

        // สีเขียว - สนทนาต่อ, ติดต่อสำเร็จ
        if (status.includes('สนทนาต่อ') || status.includes('ติดต่อสำเร็จ')) {
            return 'status-success';
        }

        return '';
    }
}
