import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateCallComponent } from './create-call.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [CreateCallComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
          path: '',
          component: CreateCallComponent,
      },
    ]),
    NgbDatepickerModule,
    FormsModule,
    JsonPipe,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    NgbTimepickerModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    FontAwesomeModule,
    NgSelectModule,
    NgbTooltipModule,
    TranslateModule,
  ]
})
export class CreateCallModule { }
