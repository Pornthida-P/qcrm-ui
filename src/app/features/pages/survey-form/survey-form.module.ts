import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyFormComponent } from './survey-form.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GetLinkSurveyModule } from '../../modals/get-link-survey/get-link-survey.module';

@NgModule({
    declarations: [SurveyFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        RouterModule.forChild([
            {
                path: '',
                component: SurveyFormComponent,
            },
        ]),
        NgbPaginationModule,
        HttpClientModule,
        NgbTooltipModule,
        GetLinkSurveyModule,
    ],
    providers: [SurveyFormService],
})
export class SurveyFormModule {}
