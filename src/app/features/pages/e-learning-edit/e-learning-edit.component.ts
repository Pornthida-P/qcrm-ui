import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ELearningService } from 'src/app/services/e-learning/e-learning.service';

@Component({
    selector: 'app-e-learning-edit',
    templateUrl: './e-learning-edit.component.html',
    styleUrl: './e-learning-edit.component.scss',
})
export class ELearningEditComponent {
    constructor(private route: ActivatedRoute, private router: Router, private eLearningService: ELearningService) {}

    cb: string = '';
    detailItem: any = undefined;
    itemId: string = '';
    emptyItem: String = 'ว่าง';
    startDate = new Date();

    item = {
        startDate: new Date(),
    };
    title = 'appBootstrap';

    model:any;

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.itemId = params['itemId'];
            this.cb = params['cb'];
        });
        this.getElearn(this.itemId);
        console.log(this.detailItem);
    }

    async getElearn(itemId: string) {
        await this.eLearningService.getELearningById(itemId).subscribe((res: any) => {
            this.detailItem = res[0];
        });
    }

    backPage() {
        console.log('go to back');
        this.router.navigate(['/e-learning'], { queryParams: { cb: this.cb } });
    }
}
