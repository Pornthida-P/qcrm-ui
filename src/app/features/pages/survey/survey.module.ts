import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SurveyComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: SurveyComponent,
            },
        ]),
    ],
})
export class SurveyModule {}
