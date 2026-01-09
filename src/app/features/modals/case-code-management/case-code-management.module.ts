import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseCodeManagementComponent } from './case-code-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [CaseCodeManagementComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, MatDialogModule, AngularEditorModule, TranslateModule],
    exports: [CaseCodeManagementComponent],
})
export class CaseCodeManagementModule {}

