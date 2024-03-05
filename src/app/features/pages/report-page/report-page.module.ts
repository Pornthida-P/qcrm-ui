import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPageComponent } from './report-page.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GetLinkSurveyModule } from '../../modals/get-link-survey/get-link-survey.module';

@NgModule({
    declarations: [ReportPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        RouterModule.forChild([
            {
                path: '',
                component: ReportPageComponent,
            },
        ]),
        NgbPaginationModule,
        HttpClientModule,
        NgbTooltipModule,
        GetLinkSurveyModule,
    ],
})
export class ReportPageModule {}
