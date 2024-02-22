import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Formio, FormioModule } from '@formio/angular';
import bootstrap4 from '@formio/bootstrap/bootstrap4';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

(Formio as any).use(bootstrap4);
(Formio as any).icons = 'fontawesome';

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
        FormioModule,
    ],
    providers: [],
})
export class SurveyModule {}
