import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { User } from 'src/app/shared/interface/user.interface';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { monthNames } from 'src/app/config/month';
import { TranslateService } from '@ngx-translate/core';

interface Day {
    number: number;
    date: Date;
}

@Component({
    selector: 'app-calendar-preview',
    templateUrl: './calendar-preview.component.html',
    styleUrl: './calendar-preview.component.scss',
})
export class CalendarPreviewComponent implements OnInit {
    @Output() selectedDate: EventEmitter<Date> = new EventEmitter();
    @Output() event: EventEmitter<CalendarEvent[]> = new EventEmitter();

    events: CalendarEvent[] = [];
    currentMonth: string;
    currentYear: string;
    weeks: Day[][] = [];
    selectDate: Date = new Date();
    onSelectEvent: CalendarEvent[] = [];

    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;

    constructor(
        config: NgbPopoverConfig,
        private modalCalendarService: ModalCalendarService,
        private calendarService: CalendarEventService,
        private sweetAlertService: SweetAlertService,
        private translateService: TranslateService,
    ) {
        translateService.setDefaultLang('th');
        const currentDate = new Date();
        this.currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
        this.currentYear = currentDate.toLocaleDateString('en-US', { year: 'numeric' });
        this.generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
        this.selectDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        config.container = 'body';
        config.autoClose = 'outside';
        config.popoverClass = 'custom-popover';
    }

    ngOnInit(): void {
        this.calendarService.onRefreshData().subscribe(() => {
            this.findEventByMonth(this.currentMonth, this.currentYear);
        });
    }

    generateCalendar(month: number, year: number): void {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfPreviousMonth = new Date(year, month, 0);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let currentWeek: Day[] = [];

        for (let i = firstDayOfMonth.getDay(); i > 0; i--) {
            const prevDate = new Date(year, month, 0 - i + 1);
            currentWeek.push({ number: prevDate.getDate(), date: prevDate });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            const dayOfWeek = currentDate.getDay();

            if (dayOfWeek === 0 && currentWeek.length > 0) {
                this.weeks.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push({ number: i, date: currentDate });
        }

        if (currentWeek.length > 0) {
            this.weeks.push(currentWeek);
        }
    }

    nextMonth(): void {
        if (this.weeks.length === 0 || this.weeks[this.weeks.length - 1].length === 0) {
            return;
        }

        const lastWeek = this.weeks[this.weeks.length - 1];
        const lastDayOfLastWeek = lastWeek[lastWeek.length - 1];

        const currentMonth = lastDayOfLastWeek.date.getMonth();
        const currentYear = lastDayOfLastWeek.date.getFullYear();

        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;

        this.weeks = [];
        this.generateCalendar(newMonth, newYear);
        this.currentMonth = new Date(newYear, newMonth).toLocaleDateString('en-US', { month: 'long' });
        this.currentYear = new Date(newYear, newMonth).toLocaleDateString('en-US', { year: 'numeric' });
        this.findEventByMonth(this.currentMonth, this.currentYear);
    }

    previousMonth(): void {
        if (this.weeks.length === 0 || this.weeks[this.weeks.length - 1].length === 0) {
            return;
        }

        const lastWeek = this.weeks[this.weeks.length - 1];
        const lastDayOfLastWeek = lastWeek[lastWeek.length - 1];

        const currentMonth = lastDayOfLastWeek.date.getMonth();
        const currentYear = lastDayOfLastWeek.date.getFullYear();

        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        this.weeks = [];
        this.generateCalendar(newMonth, newYear);
        this.currentMonth = new Date(newYear, newMonth).toLocaleDateString('en-US', { month: 'long' });
        this.currentYear = new Date(newYear, newMonth).toLocaleDateString('en-US', { year: 'numeric' });
        this.findEventByMonth(this.currentMonth, this.currentYear);
    }

    onClickSelectDate(date: Date): void {
        this.onSelectEvent = this.events.filter((event) => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            return date >= startDate && date <= endDate;
        });

        this.selectDate = date;
        this.selectedDate.emit(date);
    }

    isSelected(date: Date): boolean {
        return this.selectDate.getTime() === date.getTime();
    }

    hasEvent(date: Date): number {
        let count = 0;
        for (const event of this.events) {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            if (date >= startDate && date <= endDate) {
                count++;
                if (count >= 4) {
                    return 4;
                }
            }
        }
        return count;
    }

    getDotColor(index: number, date: Date): string {
        const filteredEvents = this.events.filter((event) => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            return date >= startDate && date <= endDate;
        });

        if (filteredEvents.length === 0) {
            return '';
        }

        const tagColor = filteredEvents[index]?.tag?.color;
        return tagColor ? tagColor : 'var(--primary)';
    }

    onClickAddEvent(): void {
        this.closePopover();

        this.modalCalendarService.openDialog('add');
    }

    onClickViewEvent(): void {
        this.closePopover();
    }

    onClickEditEvent(): void {
        this.closePopover();
    }

    onClickDeleteEvent(): void {
        this.closePopover();
    }

    onClickViewMember(userId: User): void {
        this.closePopover();
    }

    onClickEditMember(userId: User): void {
        this.closePopover();
    }

    onClickDeletedMember(userId: User): void {
        this.closePopover();
    }

    closePopover() {
        const popoverElement = document.querySelector('.popover');
        if (popoverElement) {
            popoverElement.closest('.popover')?.remove();
        }
    }

    findEventByMonth(month: string, year: string): void {
        const monthInt = monthNames[month.toLowerCase()];
        this.calendarService
            .findEventByMonth(monthInt, year)
            .pipe(
                tap((res: CalendarEvent[]) => {
                    this.events = res;
                    this.event.emit(res);
                }),
                catchError((err) => {
                    this.sweetAlertService.handleError(err);
                    throw err;
                }),
            )
            .subscribe(() => {});
    }
}
