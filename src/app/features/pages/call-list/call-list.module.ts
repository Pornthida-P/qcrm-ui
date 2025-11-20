import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CallListComponent } from './call-list.component';
@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: CallListComponent,
            },
        ]),
    ],
})
export class CallListModule {}
