import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentsListComponent } from './attachments-list.component';
import { AttachmentsModule } from '../attachments/attachments.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [AttachmentsListComponent],
    imports: [
        CommonModule,
        AttachmentsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,

                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [AttachmentsListComponent],
})
export class AttachmentsListModule {}
