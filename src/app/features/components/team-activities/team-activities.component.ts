import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { faCalendarAlt, faEdit, faList, faLocationDot, faPlusCircle, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';
import * as moment from 'moment';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-team-activities',
    templateUrl: './team-activities.component.html',
    styleUrl: './team-activities.component.scss',
})
export class TeamActivitiesComponent implements OnInit {
    @ViewChild(MatCalendar, { static: false }) calendar!: MatCalendar<Date>;
    selectedCalendarDate: Date | null = new Date();
    calendarDateEvents: CalendarEvent[] = [];
    events: any = [];

    faPlus = faPlusCircle;

    title: string = 'Team Activities';

    constructor(
        private modalCalendarService: ModalCalendarService,
        private calendarService: CalendarEventService,
        private sweetalertServices: SweetAlertService,
    ) {}

    ngOnInit(): void {
        this.calendarService.onRefreshData().subscribe(() => {
            this.refreshData();
        });
        this.onSelectedDateChanged();
    }

    findAllEvents() {
        this.calendarService
            .getAllCalendarEvent()
            .pipe(
                tap((events) => {
                    this.calendarDateEvents = events;
                    this.onSelectedDateChanged();
                }),
                catchError((error) => {
                    this.handleContactError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
        const cellDateStr = moment(cellDate).format('YYYY-MM-DD');

        if (view === 'month') {
            for (const event of this.calendarDateEvents) {
                const startDate = moment(event.startDate, 'YYYY-MM-DD').toDate();
                const endDate = moment(event.endDate, 'YYYY-MM-DD').toDate();

                if (cellDate >= startDate && cellDate <= endDate) {
                    if (cellDateStr === moment(startDate).format('YYYY-MM-DD') && cellDateStr === moment(endDate).format('YYYY-MM-DD')) {
                        return 'mat-calendar-body-comparison-start mat-calendar-body-comparison-end mat-calendar-body-in-comparison-range';
                    }
                    if (cellDateStr === moment(startDate).format('YYYY-MM-DD')) {
                        return 'mat-calendar-body-comparison-start mat-calendar-body-in-comparison-range';
                    }
                    if (cellDateStr === moment(endDate).format('YYYY-MM-DD')) {
                        return 'mat-calendar-body-comparison-end mat-calendar-body-in-comparison-range';
                    } else {
                        return 'mat-calendar-body-in-comparison-range';
                    }
                }
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
                    this.handleContactError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    onClickAddEvent() {
        this.modalCalendarService.openDialog('add');
    }

    refreshData() {
        this.events = [];
        this.calendarDateEvents = [];
        this.findAllEvents();
    }

    handleContactError(error: any) {
        let icon: string;
        let errorMessage: string;
        let title: string;
        let route: string;

        switch (error.status) {
            case 401:
                icon = 'warning';
                title = 'Warning Authentication';
                errorMessage = 'Your session has expired. Please log in again.';
                route = 'login';
                break;
            default:
                icon = 'error';
                title = 'Calendar Event Error';
                errorMessage = 'Failed to add calendar event. Please try again later.';
                route = '';
                break;
        }

        this.sweetalertServices.getSwal(icon, title, errorMessage, false, route);
    }
}
