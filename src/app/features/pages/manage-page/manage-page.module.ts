import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagePageComponent } from './manage-page.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
          path: '',
          component: ManagePageComponent,
      },
  ]),
  ]
})
export class ManagePageModule { }
