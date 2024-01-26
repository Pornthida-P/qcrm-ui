import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [ContactsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ContactsComponent,
            },
        ]),
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
    ],
})
export class ContactsModule {}
