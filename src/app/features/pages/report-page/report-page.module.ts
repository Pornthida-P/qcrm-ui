import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPageComponent } from './report-page.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SafeUrlPipe } from 'src/app/shared/pipe/safe-url.pipe';

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
            },
        ]),
        NgbPaginationModule,
        HttpClientModule,
        NgbTooltipModule,
        TranslateModule,
        SafeUrlPipe,
    ],
})
export class ReportPageModule {}
