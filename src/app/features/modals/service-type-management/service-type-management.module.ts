import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceTypeManagementComponent } from './service-type-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [ServiceTypeManagementComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        MatDialogModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        TranslateModule,
    ],
    exports: [ServiceTypeManagementComponent],
})
export class ServiceTypeManagementModule {}

