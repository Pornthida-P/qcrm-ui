import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactImportComponent } from './contact-import.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TableListModule } from 'src/app/features/components/table-list/table-list.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ContactImportManagementModule } from 'src/app/features/modals/contact-import-management/contact-import-management.module';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [ContactImportComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTooltipModule,
        MatDialogModule,
        ContactImportManagementModule,
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
                component: ContactImportComponent,
            },
        ]),
        TableListModule,
    ],
})
export class ContactImportModule {}
