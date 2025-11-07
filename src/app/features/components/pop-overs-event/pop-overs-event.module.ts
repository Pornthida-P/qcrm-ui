import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopOversEventComponent } from './pop-overs-event.component';
import { CalendarCardModule } from '../calendar-card/calendar-card.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [PopOversEventComponent],
    imports: [
        CommonModule,
        CalendarCardModule,
        FontAwesomeModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [PopOversEventComponent],
})
export class PopOversEventModule {}
