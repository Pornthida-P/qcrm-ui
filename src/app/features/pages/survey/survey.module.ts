import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

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
    ],
    providers: [],
})
export class SurveyModule {}
