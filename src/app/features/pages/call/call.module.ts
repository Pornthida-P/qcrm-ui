import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallComponent } from './call.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchPipe } from './call.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AttachmentsModule } from 'src/app/features/components/attachments/attachments.module';

@NgModule({
    declarations: [CallComponent, SearchPipe],
    imports: [
      CommonModule,
      FontAwesomeModule,
        RouterModule.forChild([
            {
                path: '',
                component: CallComponent,
            },
        ]),
      FormsModule,
      ReactiveFormsModule,
      NgbTooltipModule,
      MatDatepickerModule,
      MatInputModule,
      MatFormFieldModule,
      MatAutocompleteModule,
      NgbTimepickerModule,
      NgSelectModule,
      TranslateModule,
      AttachmentsModule

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CallModule {}
