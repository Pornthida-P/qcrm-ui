import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { tap, catchError } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    @ViewChild(MatCalendar, { static: false }) calendar!: MatCalendar<Date>;

    selectedCalendarDate: Date | null = new Date();
    calendarDateEvents: CalendarEvent[] = [];
    events: any = [];
    userData: User | null = null;
    isAction: boolean = false;

    faPlus = faPlusCircle;

    title: string = 'หน้าหลัก';

    constructor(
        private userService: UserService,
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

    getUserData() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAction = this.userData?.role.roleTitle.toLowerCase() === 'admin' ? true : false;
        });
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
