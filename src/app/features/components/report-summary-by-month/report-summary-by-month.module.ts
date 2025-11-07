import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSummaryByMonthComponent } from './report-summary-by-month.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [ReportSummaryByMonthComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        FormsModule,
        NgbTooltipModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [ReportSummaryByMonthComponent],
})
export class ReportSummaryByMonthModule {}
