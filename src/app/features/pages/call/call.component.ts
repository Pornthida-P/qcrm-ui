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

    pageSizeOptions = [10, 20];
    pageSize = 10;
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

    constructor(
        private callService: CallService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private userService: UserService,
        private sweetAlertService: SweetAlertService,
    ) {}

    ngOnInit() {
        this.getUserData();
        this.userRole = this.userData.role.roleTitle.toLocaleLowerCase();
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: this.userData.username },
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

        this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    async getCallsData(page: number, pageSize: number) {
        await this.callService
            .getCallsPage(page, pageSize, `${this.sortId},${this.sortOrder}`, this.valueSearch, this.selectedFilter)
            .subscribe((res: any) => {
                this.calls = res;
                this.calls.forEach((call) => {
                    if (call.CallType === 'I') {
                        call.CallType = this.inbound;
                    } else if (call.CallType === 'O') {
                        call.CallType = this.outbound;
                    }
                });
            });
    }

    async getCallsSide(page: number, pageSize: number, value: string) {
        await this.callService.getCalls(page, pageSize).subscribe((res: any) => {
            this.calls = Object.values(res);
            if (value == 'right') this.showSideBar(0);
            else if (value == 'left') this.showSideBar(this.pageSize - 1);
        });
    }

    showSideBar(value: number) {
        console.log('SideBar');
        this.itemIdex = value;
        this.detailItem = this.calls[this.itemIdex];
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;

        if (this.itemIdex == 0 && this.currentPage == 1) this.visibleLeftSideBar = false;
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
            if (page >= 1 && page <= this.totalPages) {
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
                this.showSideBar(this.itemIdex + 1);
            }
        } else if (value == 'left') {
            if (this.itemIdex == 0) {
                await this.pageChangeSideBar(this.currentPage - 1, value);
            } else {
                this.showSideBar(this.itemIdex - 1);
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

    async getPage() {
        await this.callService.getCallsCount(this.valueSearch, this.userId).subscribe((res: any) => {
            this.totalItems = res.count;
        });
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

    createCall() {
        this.router.navigate(['/call/create']);
    }

    getUserData() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAction = res?.role.roleTitle.toLocaleLowerCase() === 'admin' ? true : false;
        });
    }

    exportExcel() {
        if (this.selectValue.length != 0) {
            this.selectedCalls = this.calls.filter((calls: any) => this.selectValue.includes(calls.call_id));
        }

        if (this.selectedCalls.length != 0) {
            const processedForms = this.selectedCalls.reduce(
                (acc: any, cur: any) => [
                    ...acc,
                    {
                        createdAt: cur.createdAt,
                        name: cur.CallerID,
                        direction: cur.CallType,
                        caseTopicName: cur.caseTopicName,
                        description: cur.description,
                        solution: cur.solution,
                        username: cur.username,
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
                this.selectValue.push(x.call_id);
            } else {
                this.selectValue = [];
            }
        });
    }

    isAllChecked() {
        return this.calls && this.calls.every((_: any) => _.state);
    }
}
