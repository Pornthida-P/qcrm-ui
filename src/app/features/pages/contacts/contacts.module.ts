import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

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
        InputTextModule,
        ButtonModule,
        DropdownModule,
        TableModule,
        FontAwesomeModule,
        TooltipModule,
        PaginatorModule,
    ],
})
export class ContactsModule {}
