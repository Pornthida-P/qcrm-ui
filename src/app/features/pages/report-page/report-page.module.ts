import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPageComponent } from './report-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ReportPageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ReportPageComponent,
            },
        ]),
    ],
})
export class ReportPageModule {}
