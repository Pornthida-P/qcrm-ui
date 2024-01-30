import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SurveyFormComponent } from './survey-form.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { NgbdSortableHeader } from './sortable.directive';
import * as bootstrap from 'bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

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
        NgbdSortableHeader,
        HttpClientModule,
        NgbTooltipModule,
    ],
    providers: [SurveyFormService, DecimalPipe],
})
export class SurveyFormModule {}
