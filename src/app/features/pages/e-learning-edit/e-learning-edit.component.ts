import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-e-learning-edit',
    templateUrl: './e-learning-edit.component.html',
    styleUrl: './e-learning-edit.component.scss',
})
export class ELearningEditComponent {
    constructor(private route: ActivatedRoute, private router: Router) {}

    cb: string = '';
    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            const itemId: any = params['itemId'];
            this.cb = params['cb'];
            console.log('Received item:');
            console.log(itemId);
        });
    }

    backPage() {
        console.log('go to back');
        this.router.navigate(['/e-learning'], { queryParams: { cb: this.cb } });
    }
}
