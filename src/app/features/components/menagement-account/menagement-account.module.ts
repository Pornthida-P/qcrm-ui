import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenagementAccountComponent } from './menagement-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountProfileModule } from '../account-profile/account-profile.module';

@NgModule({
    declarations: [MenagementAccountComponent],
    imports: [
        CommonModule,
        FormsModule,
        AccountProfileModule,
        ReactiveFormsModule,
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
