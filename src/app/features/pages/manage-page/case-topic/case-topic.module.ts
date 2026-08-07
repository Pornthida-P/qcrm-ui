import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableListModule } from 'src/app/features/components/table-list/table-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { CaseTopicComponent } from './case-topic.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { CaseTopicTabComponent } from './tabs/case-topic-tab/case-topic-tab.component';
import { CaseSubjectTabComponent } from './tabs/case-subject-tab/case-subject-tab.component';
import { CaseTypeTabComponent } from './tabs/case-type-tab/case-type-tab.component';
import { SentimentTabComponent } from './tabs/sentiment-tab/sentiment-tab.component';

import { CaseTopicManagementModule } from 'src/app/features/modals/case-topic-management/case-topic-management.module';
import { CaseSubjectManagementModule } from 'src/app/features/modals/case-subject-management/case-subject-management.module';
import { CaseTypeManagementModule } from 'src/app/features/modals/case-type-management/case-type-management.module';
import { SentimentManagementModule } from 'src/app/features/modals/sentiment-management/sentiment-management.module';

@NgModule({
    declarations: [
        CaseTopicComponent,
        CaseTopicTabComponent,
        CaseSubjectTabComponent,
        CaseTypeTabComponent,
        SentimentTabComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        MatDialogModule,
        TableListModule,
        CaseTopicManagementModule,
        CaseSubjectManagementModule,
        CaseTypeManagementModule,
        SentimentManagementModule,
        TranslateModule,
        RouterModule.forChild([
            {
                path: '',
                component: CaseTopicComponent,
            },
        ]),
    ],
})
export class CaseTopicModule {}
