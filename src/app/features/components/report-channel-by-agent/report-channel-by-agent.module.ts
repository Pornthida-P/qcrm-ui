import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportChannelByAgentComponent } from './report-channel-by-agent.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [ReportChannelByAgentComponent],
    imports: [CommonModule, MatDatepickerModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, NgbTooltipModule],
    exports: [ReportChannelByAgentComponent],
})
export class ReportChannelByAgentModule {}
