import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseTopicManagementComponent } from './case-topic-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [CaseTopicManagementComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, MatDialogModule, AngularEditorModule, TranslateModule],
    exports: [CaseTopicManagementComponent],
})
export class CaseTopicManagementModule {}
