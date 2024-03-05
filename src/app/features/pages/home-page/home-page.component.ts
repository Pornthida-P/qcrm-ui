import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { CalendarEvent, CalendarTag } from 'src/app/shared/interface/calendar.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    tags: CalendarTag[] = [];
    events: CalendarEvent[] = [];
    onSelectTag?: CalendarTag;
    onHome: boolean = true;

    constructor(
        private calendarService: CalendarEventService,
        private sweetAlertService: SweetAlertService,
        private modalCalendarService: ModalCalendarService,
        private translateService: TranslateService,
    ) {
        translateService.setDefaultLang('th');
    }

    ngOnInit(): void {
        this.initzation();
    }

    initzation(): void {
        this.calendarService.onRefrashTag().subscribe(() => {
            this.findAllTag();
        });

        this.calendarService.onRefreshData().subscribe(() => {
            this.findEventByTagId(this.onSelectTag?.tagId);
        });
    }

    findAllTag(): void {
        this.calendarService
            .findAllTags()
            .pipe(
                tap((tags) => {
                    this.tags = tags;
                }),
                catchError((error) => {
                    this.sweetAlertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe((tags) => {});
    }

    findEventByTagId(tagId?: number): void {
        if (tagId) {
            this.calendarService
                .findEventByTagId(tagId)
                .pipe(
                    tap((events) => {
                        this.events = events;
                    }),
                    catchError((error) => {
                        this.sweetAlertService.handleError(error);
                        throw error;
                    }),
                )
                .subscribe(() => {});
        }
    }

    onClickHome(): void {
        this.onHome = true;
        this.resetSelectTag();
    }

    onClickChangeMenu(tag: CalendarTag): void {
        this.findEventByTagId(tag.tagId);

        this.onHome = false;
        this.onSelectTag = tag;
    }

    onClickAddEvent(): void {
        this.modalCalendarService.openDialog('add');
    }

    resetSelectTag(): void {
        this.onSelectTag = undefined;
        this.events = [];
    }
}
