import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallComponent } from './call.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [CallComponent],
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
    ],
})
export class CallModule {}
