import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardEventListComponent } from './card-event-list.component';
import { CalendarCardModule } from '../calendar-card/calendar-card.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EventTagListModule } from '../event-tag-list/event-tag-list.module';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [CardEventListComponent],
    imports: [
        CommonModule,
        CalendarCardModule,
        EventTagListModule,
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
    exports: [CardEventListComponent],
})
export class CardEventListModule {}
