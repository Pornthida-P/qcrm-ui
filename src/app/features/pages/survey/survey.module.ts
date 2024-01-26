import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { NgbdSortableHeader } from './sortable.directive';

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
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        NgbPaginationModule,
        NgbdSortableHeader,
    ],
    providers: [SurveyService, DecimalPipe],
})
export class SurveyModule {}
