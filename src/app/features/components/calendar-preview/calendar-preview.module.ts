import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarPreviewComponent } from './calendar-preview.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopOversEventModule } from '../pop-overs-event/pop-overs-event.module';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/nea-qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [CalendarPreviewComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        PopOversEventModule,
        NgbPopover,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [CalendarPreviewComponent],
})
export class CalendarPreviewModule {}
