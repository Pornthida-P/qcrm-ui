import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenagementPasswordComponent } from './menagement-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
    declarations: [MenagementPasswordComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MenagementPasswordComponent,
            },
        ]),
        TranslateModule,
    ],
})
export class MenagementPasswordModule {}
