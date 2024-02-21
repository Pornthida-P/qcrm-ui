import { Component, ViewChild } from '@angular/core';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { tap, catchError } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    @ViewChild(MatCalendar, { static: false }) calendar!: MatCalendar<Date>;
    selectedCalendarDate: Date | null = new Date();
    calendarDateEvents: CalendarEvent[] = [];
    events: any = [];

    faPlus = faPlusCircle;

    title: string = 'หน้าหลัก';

    constructor(
        private modalCalendarService: ModalCalendarService,
        private calendarService: CalendarEventService,
        private sweetalertServices: SweetAlertService,
    ) {}

    ngOnInit(): void {
        this.calendarService.onRefreshData().subscribe(() => {
            this.refreshData();
        });
    }

    findAllEvents() {
        this.calendarService
            .getAllCalendarEvent()
            .pipe(
                tap((events) => {
                    console.log('events', events);
                    this.calendarDateEvents = events;
                    this.onSelectedDateChanged();
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
        if (view === 'month') {
            const eventsToday = this.calendarDateEvents.filter((event) => {
                return cellDate >= new Date(event.startDate) && cellDate <= new Date(event.endDate);
            });

            if (eventsToday.length > 0) {
                return 'highlight-date';
            }
        }

        return '';
    };

    onSelectedDateChanged() {
        this.events = [];

        if (this.calendar) {
            this.calendar.monthView._init();
        }

        this.onEvent();
    }

    onEvent() {
        const selectedDateStr = moment(this.selectedCalendarDate).format('YYYY-MM-DD');

        this.calendarService
            .findByDate(selectedDateStr)
            .pipe(
                tap((events) => {
                    this.events = events;
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    onSelectDate(date: Date) {
        console.log('date', date);
        this.selectedCalendarDate = date;
        this.onSelectedDateChanged();
    }

    onClickAddEvent() {
        this.modalCalendarService.openDialog('add');
    }

    refreshData() {
        this.events = [];
        this.calendarDateEvents = [];
        this.findAllEvents();
    }
}
