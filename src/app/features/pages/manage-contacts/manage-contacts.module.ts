import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ManageContactsComponent } from './manage-contacts.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [ManageContactsComponent],
    imports: [
        CommonModule,
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
