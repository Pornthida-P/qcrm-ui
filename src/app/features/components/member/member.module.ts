import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberComponent } from './member.component';
import { RouterModule } from '@angular/router';
import { ProfileListModule } from '../profile-list/profile-list.module';
import { TableListModule } from '../table-list/table-list.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatDialogModule } from '@angular/material/dialog';
import { UserMenagementModule } from '../../modals/user-menagement/user-menagement.module';

@NgModule({
    declarations: [MemberComponent],
    imports: [
        CommonModule,
        TableListModule,
        FontAwesomeModule,
        ProfileListModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        UserMenagementModule,
        TranslateModule,
        RouterModule.forChild([
            {
                path: '',
                component: MemberComponent,
            },
        ]),
    ],
})
export class MemberModule {}
