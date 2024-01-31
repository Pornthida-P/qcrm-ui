import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPenToSquare, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ELearningService } from 'src/app/services/e-learning/e-learning.service';

@Component({
    selector: 'app-e-learning',
    templateUrl: './e-learning.component.html',
    styleUrls: ['./e-learning.component.scss'],
})
export class ELearningComponent {
    value: string = '';
    filterOption!: any[];
    selectedFilter: any | undefined;
    course: any[] = [];
    selectedCourse: any | undefined;
    faPenToSquare = faPenToSquare;
    faArrowRight = faArrowRight;
    faArrowLeft = faArrowLeft;

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

    sortId: string = '-';
    sortOrder: string = 'ASC';
    sortIcon: string = '';
    constructor(private eLearningService: ELearningService, private router: Router, private activeRoute: ActivatedRoute) {}

    ngOnInit() {
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: 'me' },
        ];
        this.selectedFilter = this.filterOption[0].code;

        this.activeRoute.queryParams.subscribe((params) => {
            if (params['cb'] != undefined && params['cb'] != '') {
                const cbArray = params['cb'].split(',').map(Number);
                this.pageSize = cbArray[0];
                this.currentPage = cbArray[1];
                this.totalItems = cbArray[2];
                this.totalPages = cbArray[3];
            }
        });

        this.getElearn((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    async getElearn(page: number, pageSize: number) {
        await this.eLearningService
            .getELearning(page, pageSize, `${this.sortId},${this.sortOrder}`, this.value, this.selectedFilter)
            .subscribe((res: any) => {
                this.course = res;
            });
    }

    async getElearnSideBar(page: number, pageSize: number, value: string) {
        await this.eLearningService
            .getELearning(page, pageSize, `${this.sortId},${this.sortOrder}`, this.value, this.selectedFilter)
            .subscribe((res: any) => {
                this.course = res;
            })
            .add(() => {
                if (value == 'right') this.showSideBar(0);
                else if (value == 'left') this.showSideBar(this.pageSize - 1);
            });
    }

    async getPage() {
        await this.eLearningService.getELearningPage(this.value, this.selectedFilter).subscribe((res: any) => {
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
        console.log(`${this.pageSize},${this.currentPage},${this.totalItems},${this.totalPages}`);
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                await this.getElearn((this.currentPage - 1) * this.pageSize, this.pageSize);
            }
        }
    }

    pageChangeSideBar(page: number, value: string): void {
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.getElearnSideBar((this.currentPage - 1) * this.pageSize, this.pageSize, value);
            }
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.getElearn((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    showSideBar(value: number) {
        this.itemIdex = value;
        this.detailItem = this.course[this.itemIdex];
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;

        if (this.itemIdex == 0 && this.currentPage == 1) this.visibleLeftSideBar = false;
        if (this.itemIdex == this.course.length - 1 && this.currentPage == this.totalPages) this.visibleRightSideBar = false;
    }

    sort(value: string) {
        if (this.sortId == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrder = 'DESC';
            } else {
                this.sortId = '-';
                this.sortIcon = '';
            }
        } else {
            this.sortId = value;
            this.sortIcon = 'fa-solid fa-sort-down';
            this.sortOrder = 'ASC';
        }
        this.getElearn((this.currentPage - 1) * this.pageSize, this.pageSize);
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

    editPage(item: any) {
        const cb = `${this.pageSize},${this.currentPage},${this.totalItems},${this.totalPages}`;
        this.router.navigate(['/e-learning/edit'], { queryParams: { itemId: item.activityTopicId, cb: cb } });
    }

    onSearchChange() {
        this.getElearn((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }
}
