import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ELearningEditComponent } from './e-learning-edit.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
        NgbModule,
        FormsModule
    ],
})
export class ELearningEditModule {}
