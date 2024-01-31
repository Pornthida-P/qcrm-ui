import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateCallComponent } from './create-call.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
          path: '',
          component: CreateCallComponent,
      },
  ]),
  ]
})
export class CreateCallModule { }
