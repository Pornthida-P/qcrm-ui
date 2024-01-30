import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenagementAccountComponent } from '../menagement-account/menagement-account.component';
import { Router, RouterModule } from '@angular/router';
import { MenagementAppearanceComponent } from './menagement-appearance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [MenagementAppearanceComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MenagementAppearanceComponent,
            },
        ]),
    ],
})
export class MenagementAppearanceModule {}
