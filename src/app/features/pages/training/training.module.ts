import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingComponent } from './training.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [TrainingComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: TrainingComponent,
            },
        ]),
    ],
})
export class TrainingModule {}
