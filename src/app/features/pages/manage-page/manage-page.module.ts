import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagePageComponent } from './manage-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactImportComponent } from './contact-import/contact-import.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

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
                        redirectTo: 'contact-import',
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
                        path: 'contact-import',
                        loadChildren: () => import('./contact-import/contact-import.module').then((m) => m.ContactImportModule),
                    },
                ],
            },
        ]),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        FontAwesomeModule,
        ReactiveFormsModule,
        FormsModule,
    ],
})
export class ManagePageModule {}
