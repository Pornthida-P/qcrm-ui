import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { LeadManagementComponent } from './lead-management.component';
import { ContactImportManagementModule } from 'src/app/features/modals/contact-import-management/contact-import-management.module';

const routes: Routes = [
    {
        path: '',
        component: LeadManagementComponent,
    },
];

@NgModule({
    declarations: [LeadManagementComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        TranslateModule,
        NgbTooltipModule,
        MatDialogModule,
        ContactImportManagementModule,
    ],
})
export class LeadManagementModule {}

