import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSurveyFormComponent } from './manage-survey-form.component';
import { RouterModule } from '@angular/router';
import { Formio, FormioModule } from '@formio/angular';
import bootstrap4 from '@formio/bootstrap/bootstrap4';
(Formio as any).use(bootstrap4);
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
  ]
})
export class ManageSurveyFormModule { }
