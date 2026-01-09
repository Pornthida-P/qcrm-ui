import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableListModule } from 'src/app/features/components/table-list/table-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { CaseTopicComponent } from './case-topic.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

// Tab Components
import { CaseCodeTabComponent } from './tabs/case-code-tab/case-code-tab.component';
import { CaseTypeTabComponent } from './tabs/case-type-tab/case-type-tab.component';
import { ServiceGroupTabComponent } from './tabs/service-group-tab/service-group-tab.component';
import { ServiceTypeTabComponent } from './tabs/service-type-tab/service-type-tab.component';
import { ServiceSubTypeTabComponent } from './tabs/service-sub-type-tab/service-sub-type-tab.component';
import { SentimentTabComponent } from './tabs/sentiment-tab/sentiment-tab.component';

// Modal Modules
import { CaseCodeManagementModule } from 'src/app/features/modals/case-code-management/case-code-management.module';
import { CaseTypeManagementModule } from 'src/app/features/modals/case-type-management/case-type-management.module';
import { ServiceGroupManagementModule } from 'src/app/features/modals/service-group-management/service-group-management.module';
import { ServiceTypeManagementModule } from 'src/app/features/modals/service-type-management/service-type-management.module';
import { ServiceSubTypeManagementModule } from 'src/app/features/modals/service-sub-type-management/service-sub-type-management.module';
import { SentimentManagementModule } from 'src/app/features/modals/sentiment-management/sentiment-management.module';

@NgModule({
    declarations: [
        CaseTopicComponent,
        CaseCodeTabComponent,
        CaseTypeTabComponent,
        ServiceGroupTabComponent,
        ServiceTypeTabComponent,
        ServiceSubTypeTabComponent,
        SentimentTabComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        MatDialogModule,
        TableListModule,
        CaseCodeManagementModule,
        CaseTypeManagementModule,
        ServiceGroupManagementModule,
        ServiceTypeManagementModule,
        ServiceSubTypeManagementModule,
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
