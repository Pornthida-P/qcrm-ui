import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceSubTypeManagementComponent } from './service-sub-type-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [ServiceSubTypeManagementComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, MatDialogModule, TranslateModule],
    exports: [ServiceSubTypeManagementComponent],
})
export class ServiceSubTypeManagementModule {}

