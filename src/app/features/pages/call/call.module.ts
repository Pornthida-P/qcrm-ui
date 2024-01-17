import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallComponent } from './call.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [CallComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: CallComponent,
            },
        ]),
    ],
})
export class CallModule {}
