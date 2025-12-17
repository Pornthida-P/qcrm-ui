import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenagementAccountComponent } from './menagement-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountProfileModule } from '../account-profile/account-profile.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [MenagementAccountComponent],
    imports: [
        CommonModule,
        FormsModule,
        AccountProfileModule,
        ReactiveFormsModule,
        TranslateModule,
        RouterModule.forChild([
            {
                path: '',
                component: MenagementAccountComponent,
            },
        ]),
    ],
    exports: [],
})
export class MenagementAccountModule {}
