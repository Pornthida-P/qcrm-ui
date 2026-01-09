import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceTypeManagementComponent } from './service-type-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [ServiceTypeManagementComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, MatDialogModule, TranslateModule],
    exports: [ServiceTypeManagementComponent],
})
export class ServiceTypeManagementModule {}

