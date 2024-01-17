import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ELearningComponent } from './e-learning.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ELearningComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ELearningComponent,
            },
        ]),
    ],
})
export class ELearningModule {}
