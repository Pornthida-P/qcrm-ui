import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagePageComponent } from './manage-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ManagePageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ManagePageComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'lead-management',
                        pathMatch: 'full',
                    },
                    {
                        path: 'menagement-member',
                        loadChildren: () => import('../../components/member/member.module').then((m) => m.MemberModule),
                    },
                    {
                        path: 'case-topic',
                        loadChildren: () => import('./case-topic/case-topic.module').then((m) => m.CaseTopicModule),
                    },
                    {
                        path: 'lead-management',
                        loadChildren: () => import('./lead-management/lead-management.module').then((m) => m.LeadManagementModule),
                    },
                ],
            },
        ]),
        TranslateModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        FormsModule,
    ],
})
export class ManagePageModule {}
