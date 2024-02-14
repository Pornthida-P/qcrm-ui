import { Component, Pipe, PipeTransform, OnInit } from '@angular/core';
import { faPenToSquare, faTrashCan, faArrowRight, faArrowLeft, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Call } from 'src/app/shared/interface/call';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import Swal from 'sweetalert2';
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

// search ทีละ field
// export class SearchPipe implements PipeTransform {
//   transform(value: any, args: any, filter: any): any {
//       if (value) {
//           return value.filter((val: Call) => {
//               switch (filter) {
//                   case 'all':
//                       if (!args) return true;
//                       else return val.mobilePhone.toLocaleLowerCase().includes(args)
//                           || val.agent.toLocaleLowerCase().includes(args)
//                           || val.solutions.toLocaleLowerCase().includes(args)
//                           || val.detail.toLocaleLowerCase().includes(args)
//                           || val.subject.toLocaleLowerCase().includes(args)
//                           || val.typePhone.toLocaleLowerCase().includes(args)
//                           || val.time.toLocaleLowerCase().includes(args);
//                   default:
//                       if (!args) return val.agent.toLocaleLowerCase().includes(filter)
//                           || val.solutions.toLocaleLowerCase().includes(filter)
//                           || val.detail.toLocaleLowerCase().includes(filter)
//                           || val.subject.toLocaleLowerCase().includes(filter)
//                           || val.typePhone.toLocaleLowerCase().includes(filter)
//                           || val.time.toLocaleLowerCase().includes(filter);
//                       else return val.agent.toLocaleLowerCase().includes(filter)
//                           && val.mobilePhone.toLocaleLowerCase().includes(args)
//                           && val.solutions.toLocaleLowerCase().includes(filter)
//                           && val.detail.toLocaleLowerCase().includes(filter)
//                           && val.subject.toLocaleLowerCase().includes(filter)
//                           && val.typePhone.toLocaleLowerCase().includes(filter)
//                           && val.time.toLocaleLowerCase().includes(filter);
//               }
//           });
//       }
//   }
// }

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

    userData: any;

    sortId: string = '-';
    sortOrder: string = 'ASC';
    sortIcon: string = '';

    constructor(
        private callService: CallService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private userService: UserService,
    ) {}

    ngOnInit() {
        this.getUserData();

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
        this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    async getCallsData(page: number, pageSize: number) {
        await this.callService.getCallsPage(page, pageSize, `${this.sortId},${this.sortOrder}`).subscribe((res: any) => {
            this.calls = Object.values(res);
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

    // editPage(item: any) {
    //     console.log('go to editpage');
    //     console.log(item);
    //     const cb = `${this.pageSize},${this.currentPage},${this.totalItems},${this.totalPages}`;
    //     this.router.navigate(['/'], { queryParams: { itemId: item.activityTopicId, cb: cb } });
    // }

    editPage() {
        this.router.navigate(['/call/edit'])
    }

    async pageChange(page: number) {
        console.log(`${this.pageSize},${this.currentPage},${this.totalItems},${this.totalPages}`);
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                await this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
            }
        }
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

    getPage() {
        this.callService.getCallsCount().subscribe((res: any) => {
            this.totalItems = res.count;
        });
    }

    search() {
        this.calls.filter((item: any) => item.mobilePhone.toLowerCase().includes(this.valueSearch.toLowerCase()));
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

  deleteCall() {
    Swal.fire({
      icon: 'warning',
      title: 'Do you want to delete this form?',
      showCancelButton: true,
      confirmButtonColor: '#3066be',
      cancelButtonColor: '#ec5365',
      width: '50%',
  })
    }
}
