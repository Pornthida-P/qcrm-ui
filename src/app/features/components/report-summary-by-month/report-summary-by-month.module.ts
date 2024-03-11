import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSummaryByMonthComponent } from './report-summary-by-month.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [ReportSummaryByMonthComponent],
    imports: [CommonModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, NgbTooltipModule],
    exports: [ReportSummaryByMonthComponent],
})
export class ReportSummaryByMonthModule {}
