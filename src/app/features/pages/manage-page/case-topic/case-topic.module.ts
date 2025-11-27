import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableListModule } from 'src/app/features/components/table-list/table-list.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CaseTopicComponent } from './case-topic.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { CaseTopicManagementModule } from 'src/app/features/modals/case-topic-management/case-topic-management.module';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [CaseTopicComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        MatDialogModule,
        TableListModule,
        CaseTopicManagementModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        RouterModule.forChild([
            {
                path: '',
                component: CaseTopicComponent,
            },
        ]),
    ],
})
export class CaseTopicModule {}
