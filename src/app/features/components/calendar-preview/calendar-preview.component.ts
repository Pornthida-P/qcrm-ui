import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';

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
    @Input() events: CalendarEvent[] = [];
    @Output() selectedDate: EventEmitter<Date> = new EventEmitter();

    currentMonth: string;
    weeks: Day[][] = [];
    selectDate: Date = new Date();

    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;

    constructor() {
        const currentDate = new Date();
        this.currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        this.generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
        this.selectDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    }

    ngOnInit(): void {}

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
        this.currentMonth = new Date(newYear, newMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    previousMonth(): void {
        const currentMonth = this.weeks[0][0].date.getMonth();
        const currentYear = this.weeks[0][0].date.getFullYear();

        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        this.weeks = [];
        this.generateCalendar(newMonth, newYear);
        this.currentMonth = new Date(newYear, newMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    addEvent(date: Date): void {
        this.selectedDate.emit(date);

        this.selectDate = date;
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
}
