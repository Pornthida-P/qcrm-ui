import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPageComponent } from './report-page.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReportChannelByAgentComponent } from '../../components/report-channel-by-agent/report-channel-by-agent.component';
import { ReportCaseTypeByAgentComponent } from '../../components/report-case-type-by-agent/report-case-type-by-agent.component';
import { ReportChannelByAgentModule } from '../../components/report-channel-by-agent/report-channel-by-agent.module';
import { ReportCaseTypeByAgentModule } from '../../components/report-case-type-by-agent/report-case-type-by-agent.module';

@NgModule({
    declarations: [ReportPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        RouterModule.forChild([
            {
                path: '',
                component: ReportPageComponent,
                children: [
                    {
                        path: 'channel-by-agent',
                        component: ReportChannelByAgentComponent,
                    },
                    {
                        path: 'case-type-by-agent',
                        component: ReportCaseTypeByAgentComponent,
                    }
                ],
            },
        ]),
        NgbPaginationModule,
        HttpClientModule,
        NgbTooltipModule,
        ReportChannelByAgentModule,
        ReportCaseTypeByAgentModule,
    ],
})
export class ReportPageModule {}
