import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CallListComponent } from './call-list.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [CallListComponent],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        NgbTooltipModule,
        RouterModule.forChild([
            {
                path: '',
                component: CallListComponent,
            },
        ]),
    ],
})
export class CallListModule {}
