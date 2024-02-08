import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeCallComponent } from './change-call.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
          path: '',
          component: ChangeCallComponent,
      },
    ]),
    NgbDatepickerModule,
    FormsModule,
    JsonPipe,
  ]
})
export class ChangeCallModule { }
