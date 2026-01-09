import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentimentManagementComponent } from './sentiment-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [SentimentManagementComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, MatDialogModule, TranslateModule],
    exports: [SentimentManagementComponent],
})
export class SentimentManagementModule {}

