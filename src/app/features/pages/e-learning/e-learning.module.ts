import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ELearningComponent } from './e-learning.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
    ],
})
export class ELearningModule {}
