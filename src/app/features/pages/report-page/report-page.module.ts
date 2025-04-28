import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPageComponent } from './report-page.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReportChannelByAgentComponent } from '../../components/report-channel-by-agent/report-channel-by-agent.component';
import { ReportCaseTypeByAgentComponent } from '../../components/report-case-type-by-agent/report-case-type-by-agent.component';
import { ReportChannelByAgentModule } from '../../components/report-channel-by-agent/report-channel-by-agent.module';
import { ReportCaseTypeByAgentModule } from '../../components/report-case-type-by-agent/report-case-type-by-agent.module';
import { ReportSummaryByMonthComponent } from '../../components/report-summary-by-month/report-summary-by-month.component';
import { ReportSummaryByMonthModule } from '../../components/report-summary-by-month/report-summary-by-month.module';
import { ReportCaseDetailModule } from '../../components/report-case-detail/report-case-detail.module';
import { ReportCaseDetailComponent } from '../../components/report-case-detail/report-case-detail.component';
import { ReportSendSurveyComponent } from '../../components/report-send-survey/report-send-survey.component';
import { ReportSendSurveyModule } from '../../components/report-send-survey/report-send-survey.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ReportSurveyFormComponent } from '../../components/report-survey-form/report-survey-form.component';
import { ReportSurveyFormModule } from '../../components/report-survey-form/report-survey-form.module';
import { ReportSurveySendByAgentComponent } from '../../components/report-survey-send-by-agent/report-survey-send-by-agent.component';
import { ReportSurveySendByAgentModule } from '../../components/report-survey-send-by-agent/report-survey-send-by-agent.module';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/nea-qcrm-ui/i18n/', '.json');
}

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
                    },
                    {
                        path: 'case-detail',
                        component: ReportCaseDetailComponent,
                    },
                    {
                        path: 'summary-by-month',
                        component: ReportSummaryByMonthComponent,
                    },
                    {
                        path: 'survey-send',
                        component: ReportSendSurveyComponent,
                    },
                    {
                        path: 'survey-form',
                        component: ReportSurveyFormComponent,
                    },
                    {
                        path: 'survey-send-by-agent',
                        component: ReportSurveySendByAgentComponent,
                    },
                ],
            },
        ]),
        NgbPaginationModule,
        HttpClientModule,
        NgbTooltipModule,
        ReportChannelByAgentModule,
        ReportCaseTypeByAgentModule,
        ReportSummaryByMonthModule,
        ReportCaseDetailModule,
        ReportSendSurveyModule,
        ReportSurveyFormModule,
        ReportSurveySendByAgentModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
})
export class ReportPageModule {}
