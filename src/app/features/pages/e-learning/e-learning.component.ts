import { Component, ViewChild } from '@angular/core';
import { faPenToSquare, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ELearningService } from 'src/app/services/e-learning/e-learning.service';
import { Paginator } from 'primeng/paginator';

@Component({
    selector: 'app-e-learning',
    templateUrl: './e-learning.component.html',
    styleUrls: ['./e-learning.component.scss'],
})
export class ELearningComponent {
    @ViewChild('paginator') paginator: Paginator | undefined;

    value: string | undefined;
    filterOption!: any[];
    selectedFilter: any | undefined;
    course: any[] = [];
    selectedCourse: any | undefined;
    faPenToSquare = faPenToSquare;
    faArrowRight = faArrowRight;
    faArrowLeft = faArrowLeft;

    pageSize = 10;
    pageSizeOptions = [10, 20];
    totalItems = 0;
    firstItem = 1;
    lastItem = 10;

    displaySideBar: boolean = false;
    detailItem: any = undefined;
    emptyItem: String = 'ว่าง';
    itemIdex: number = 0;

    constructor(private eLearningService: ELearningService) {}

    ngOnInit() {
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: 'me' },
        ];
        this.selectedFilter = this.filterOption[0];

        this.getElearn(this.firstItem, this.pageSize);
        this.getPage();
    }

    async getElearn(firstItem: number, pageSize: number) {
        await this.eLearningService.getELearning(firstItem, pageSize).subscribe((res: any) => {
            this.course = res;
        });
    }

    async getPage() {
        await this.eLearningService.getELearningPage().subscribe((res: any) => {
            this.totalItems = res.count;
        });
    }

    async pageChange(event: any): Promise<void> {
        console.log(event);
        if (!(this.firstItem == event.first && this.lastItem && event.first + event.rows && this.pageSize == event.rows)) {
            this.firstItem = event.first + 1;
            this.lastItem = event.first + event.rows;
            if (this.lastItem > this.totalItems) this.lastItem = this.totalItems;
            this.pageSize = event.rows;
            await this.getElearn(event.first, event.rows);
            console.log('Before pageChange');
        }
    }

    showSideBar(value: number) {
        this.itemIdex = value;
        this.detailItem = this.course[this.itemIdex];
        this.displaySideBar = true;
        console.log(this.itemIdex);
    }

    async changeSideBar(value: string, event: any) {
        if (value == 'right') {
            if (this.itemIdex >= this.pageSize - 1) {
                if (this.paginator) {
                    console.log('Before changePageToNext');

                    await this.paginator.changePageToNext(event);
                    console.log('After changePageToNext');

                }
                console.log('Before showSideBar');

                this.showSideBar(0);
                console.log('After showSideBar');

            } else {
                this.showSideBar(this.itemIdex + 1);
            }
        } else if (value == 'left') {
            if (this.itemIdex == 0) {
                if (this.paginator) {
                    await this.paginator.changePageToPrev(event);
                }
                this.showSideBar(this.pageSize);
            } else {
                this.showSideBar(this.itemIdex - 1);
            }
        }
    }
}
