import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberComponent } from './member.component';
import { RouterModule } from '@angular/router';
import { ProfileListModule } from '../profile-list/profile-list.module';
import { TableListModule } from '../table-list/table-list.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [MemberComponent],
    imports: [
        CommonModule,
        TableListModule,
        FontAwesomeModule,
        ProfileListModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MemberComponent,
            },
        ]),
    ],
})
export class MemberModule {}
