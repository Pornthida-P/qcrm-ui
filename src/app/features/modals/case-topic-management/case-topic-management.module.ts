import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseTopicManagementComponent } from './case-topic-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [CaseTopicManagementComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, MatDialogModule, TranslateModule],
    exports: [CaseTopicManagementComponent],
})
export class CaseTopicManagementModule {}
