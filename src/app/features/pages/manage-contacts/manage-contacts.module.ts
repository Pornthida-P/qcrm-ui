import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ManageContactsComponent } from './manage-contacts.component';
import { RouterModule } from '@angular/router';
import { Formio, FormioModule } from '@formio/angular';
import bootstrap4 from '@formio/bootstrap/bootstrap4';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactsService } from 'src/app/services/contacts/contacts.service';

(Formio as any).use(bootstrap4);
(Formio as any).icons = 'fontawesome';

@NgModule({
    declarations: [ManageContactsComponent],
    imports: [
        CommonModule,
        FormioModule,
        RouterModule.forChild([
            {
                path: '',
                component: ManageContactsComponent,
            },
        ]),
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [ContactsService, DecimalPipe],
})
export class ManageContactsModule {}
