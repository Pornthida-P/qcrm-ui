import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarCardComponent } from './calendar-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModule } from '../profile/profile.module';
import { ProfileListModule } from '../profile-list/profile-list.module';
import { AttachmentsListModule } from '../attachments-list/attachments-list.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [CalendarCardComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        NgbTooltipModule,
        ProfileModule,
        ProfileListModule,
        AttachmentsListModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [CalendarCardComponent],
})
export class CalendarCardModule {}
