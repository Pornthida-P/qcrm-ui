import { Component } from '@angular/core';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { ELearningService } from 'src/app/services/e-learning/e-learning.service';

@Component({
    selector: 'app-e-learning',
    templateUrl: './e-learning.component.html',
    styleUrls: ['./e-learning.component.scss'],
})
export class ELearningComponent {
    value: string | undefined;
    filterOption!: any[];
    selectedFilter: any | undefined;
    surveys: any[] = [];
    selectedSurvey: any | undefined;
    faPenToSquare = faPenToSquare;

    pageSize = 10;
    pageSizeOptions = [10, 20];
    totalItems = 0;
    firstItem = 1;
    lastItem = 10;

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
            this.surveys = res;
        });
    }

    async getPage() {
        await this.eLearningService.getELearningPage().subscribe((res: any) => {
            this.totalItems = res.count;
        });
    }

    async pageChange(event: any): Promise<void> {
        if (!(this.firstItem == event.first && this.lastItem && event.first + event.rows && this.pageSize == event.rows)) {
            this.firstItem = event.first;
            this.lastItem = event.first + event.rows;
            this.pageSize = event.rows;
            await this.getElearn(event.first, event.rows);
        }
    }
}
