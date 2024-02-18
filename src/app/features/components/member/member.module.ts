import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberComponent } from './member.component';
import { RouterModule } from '@angular/router';
import { ProfileListComponent } from '../profile-list/profile-list.component';
import { ProfileListModule } from '../profile-list/profile-list.module';

@NgModule({
    declarations: [MemberComponent],
    imports: [
        CommonModule,
        ProfileListModule,
        RouterModule.forChild([
            {
                path: '',
                component: MemberComponent,
            },
        ]),
    ],
})
export class MemberModule {}
