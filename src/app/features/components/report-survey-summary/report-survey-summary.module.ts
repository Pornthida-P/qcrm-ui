import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportSurveySummaryComponent } from './report-survey-summary.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/nea-qcrm-ui/i18n/', '.json');
}
@NgModule({
  declarations: [ReportSurveySummaryComponent],
   imports: [
          CommonModule,
          ReactiveFormsModule,
          FormsModule,
          MatInputModule,
          MatDatepickerModule,
          FontAwesomeModule,
          NgbTooltipModule,
          TranslateModule.forChild({
              loader: {
                  provide: TranslateLoader,
                  useFactory: HttpLoaderFactory,
                  deps: [HttpClient],
              },
          }),
      ],
      exports: [ReportSurveySummaryComponent],
})
export class ReportSurveySummaryModule { }
