import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyFormComponent } from './survey-form.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SurveyFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: SurveyFormComponent,
            },
        ]),
    ],
})
export class SurveyFormModule {}
