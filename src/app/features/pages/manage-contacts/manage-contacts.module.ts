import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ManageContactsComponent } from './manage-contacts.component';
import { RouterModule } from '@angular/router';
import { Formio, FormioModule } from '@formio/angular';
import bootstrap4 from '@formio/bootstrap/bootstrap4';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

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
        MatInputModule,
        NgbTimepickerModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        NgSelectModule,
        NgbTooltipModule,
    ],
    providers: [ContactsService, DecimalPipe],
})
export class ManageContactsModule {}
