import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactImportManagementComponent } from './contact-import-management.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [ContactImportManagementComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        MatDialogModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [ContactImportManagementComponent],
})
export class ContactImportManagementModule {}
