import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyFormComponent } from './survey-form.component';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'primeng/tooltip';
@NgModule({
    declarations: [SurveyFormComponent],
    imports: [
      CommonModule,
      TableModule,
      FormsModule,
      ReactiveFormsModule,
      InputTextModule,
      ButtonModule,
      DropdownModule,
      FontAwesomeModule,
      TooltipModule,
        RouterModule.forChild([
            {
                path: '',
                component: SurveyFormComponent,
            },
        ]),
    ],
})
export class SurveyFormModule {}
