import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ELearningEditComponent } from './e-learning-edit.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ELearningEditComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ELearningEditComponent,
            },
        ]),
    ],
})
export class ELearningEditModule {}
