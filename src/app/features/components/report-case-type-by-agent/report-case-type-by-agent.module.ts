import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportCaseTypeByAgentComponent } from './report-case-type-by-agent.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [ReportCaseTypeByAgentComponent],
    imports: [CommonModule, MatDatepickerModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, NgbTooltipModule],
    exports: [ReportCaseTypeByAgentComponent],
})
export class ReportCaseTypeByAgentModule {}
