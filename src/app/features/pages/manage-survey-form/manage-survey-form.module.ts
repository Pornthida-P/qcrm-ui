import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ManageSurveyFormComponent } from './manage-survey-form.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';

@NgModule({
    declarations: [ManageSurveyFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ManageSurveyFormComponent,
            },
        ]),
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [SurveyFormService, DecimalPipe],
})
export class ManageSurveyFormModule {}
