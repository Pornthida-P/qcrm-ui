import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PhoneContactsComponent } from './phone-contacts.component';
import { RouterModule } from '@angular/router';
import { FormioModule } from '@formio/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactsService } from 'src/app/services/contacts/contacts.service';

@NgModule({
  declarations: [PhoneContactsComponent],
  imports: [
    CommonModule,
    FormioModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
          path: '',
          component: PhoneContactsComponent,
      }
    ])
  ],
  providers: [
    ContactsService, DecimalPipe
  ]
})
export class PhoneContactsModule { }
