import { Component } from '@angular/core';
import { faPenToSquare, faTrashCan, faArrowRight, faArrowLeft, faCircleXmark, } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent {

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

  pageSizeOptions = [10, 20];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  pagesToShow = 3;

  filterOption!: any[];
  selectedFilter: any | undefined;


  constructor(private callService: CallService, private router: Router, private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.filterOption = [
      { name: 'ทั้งหมด', code: 'all' },
      { name: 'Only My', code: 'me' },
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
    this.selectedFilter = this.filterOption[0];
    this.getCallsData((this.currentPage - 1) * this.pageSize, this.pageSize);
    this.getPage();
  }

  getCallsData(page: number, pageSize: number) {
    this.callService.getCalls(page, pageSize).subscribe((res: any) => {
      this.calls = Object.values(res);
    })
  }

  async getCallsSide(page: number, pageSize: number, value: string) {
    await this.callService
      .getCalls(page, pageSize)
      .subscribe((res: any) => {
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

  editPage(item: any) {
    console.log('go to editpage');
    console.log(item);
    const cb = `${this.pageSize},${this.currentPage},${this.totalItems},${this.totalPages}`;
    this.router.navigate(['/e-learning/edit'], { queryParams: { itemId: item.activityTopicId, cb: cb } });
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
    this.callService.getCallsPage().subscribe((res: any) => {
      this.totalItems = res.count;
    });
  }
}
