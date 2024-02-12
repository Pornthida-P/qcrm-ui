import { Component, OnInit } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { CalendarEvent, CalendarTag } from 'src/app/shared/interface/calendar.interface';

@Component({
    selector: 'app-announce-list',
    templateUrl: './announce-list.component.html',
    styleUrl: './announce-list.component.scss',
})
export class AnnounceListComponent implements OnInit {
    calendarEvent: CalendarEvent[] = [];
    tags: CalendarTag[] = [];

    faPlus = faPlusCircle;

    constructor(
        private calendarService: CalendarEventService,
        private sweetalertServices: SweetAlertService,
        private modalCalendarService: ModalCalendarService,
    ) {}

    ngOnInit(): void {
        this.getCalendarTag();
        this.getCalendarEvent();

        this.calendarService.onRefreshData().subscribe(() => {
            this.getCalendarEvent();
        });
    }

    getCalendarTag() {
        this.calendarService
            .findAllTags()
            .pipe(
                tap((res) => {
                    this.tags = res;
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe((res) => {});
    }

    getCalendarEvent() {
        const date = moment().format('YYYY-MM-DD');

        this.calendarService
            .findByDate(date)
            .pipe(
                tap((res: CalendarEvent[]) => {
                    this.calendarEvent = res;
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe((res) => {});
    }

    findCalendarByTagId(tag: number): any[] {
        const item = this.calendarEvent.filter((event) => event.tag.tagId === tag);
        return item;
    }

    onClickAddEvent() {
        this.modalCalendarService.openDialog('add');
    }
}
