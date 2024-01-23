import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSurveyFormComponent } from './manage-survey-form.component';
import { RouterModule } from '@angular/router';
import { Formio, FormioModule } from '@formio/angular';
import bootstrap4 from '@formio/bootstrap/bootstrap4';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

(Formio as any).use(bootstrap4);
(Formio as any).icons = 'fontawesome';

@NgModule({
    declarations: [ManageSurveyFormComponent],
    imports: [
        CommonModule,
        FormioModule,
        RouterModule.forChild([
            {
                path: '',
                component: ManageSurveyFormComponent,
            },
        ]),
        FontAwesomeModule,
    ],
})
export class ManageSurveyFormModule {}
