import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventTagListComponent } from './event-tag-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AttachmentsListModule } from '../attachments-list/attachments-list.module';
import { ProfileModule } from '../profile/profile.module';
import { ProfileListModule } from '../profile-list/profile-list.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [EventTagListComponent],
    imports: [
        CommonModule,
        AttachmentsListModule,
        ProfileModule,
        ProfileListModule,
        NgbTooltipModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [EventTagListComponent],
})
export class EventTagListModule {}
