import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HomePageComponent } from './home-page.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [HomePageComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgbTooltipModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePageComponent,
            },
        ]),
        HighchartsChartModule,
        TranslateModule,
    ],
    providers: [],
    exports: [],
})
export class HomePageModule {}
