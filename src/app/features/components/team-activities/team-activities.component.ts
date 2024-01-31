import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { faCalendarAlt, faEdit, faList, faLocationDot, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';

@Component({
    selector: 'app-team-activities',
    templateUrl: './team-activities.component.html',
    styleUrl: './team-activities.component.scss',
})
export class TeamActivitiesComponent implements OnInit {
    @ViewChild(MatCalendar, { static: false }) calendar!: MatCalendar<Date>;
    selectedCalendarDate: Date | null = new Date();
    calendarDateEvents: Map<string, any> = new Map();
    events: any = [];

    faCalendar = faCalendarAlt;
    faList = faList;
    faLocation = faLocationDot;
    faUserGroup = faUserGroup;
    faEdit = faEdit;
    faTrash = faTrash;

    profileError: string = '/assets/nea-qcrm-ui/image/profile/user.jpg';

    ngOnInit(): void {
        this.calendarDateEvents.set('2024-02-15', [
            {
                title: 'Meeting',
                location: 'Conference Room',
                datetime: '2024-02-15T10:00:00',
                description: 'Team meeting',
                members: [
                    {
                        userId: '2',
                        username: 'Jukkrit',
                        email: 'jukkrit@convergence.co.th',
                        profile: '',
                        group: 'developer',
                        role: 'agent',
                    },
                ],
            },
        ]);

        this.calendarDateEvents.set('2024-01-31', [
            {
                title: 'อบรมสัมนา',
                location: 'ฉะเชิงเทรา',
                datetime: '2024-01-31T18:30:00',
                description: 'Description for Event 2',
                members: [
                    {
                        userId: '2',
                        username: 'Jukkrit',
                        email: 'jukkrit@convergence.co.th',
                        profile: '',
                        group: 'developer',
                        role: 'agent',
                    },
                    {
                        userId: '1',
                        username: 'admin',
                        email: 'admin@convergence.co.th',
                        profile: '',
                        group: 'developer',
                        role: 'admin',
                    },
                ],
            },
            {
                title: 'เรียนรู้เพิ่มเติม',
                location: 'กรุงเทพ',
                datetime: '2024-02-20T20:00:00',
                description: 'Description for Event 3',
                members: [
                    {
                        userId: '1',
                        username: 'admin',
                        email: 'admin@convergence.co.th',
                        profile: '',
                        group: 'developer',
                        role: 'admin',
                    },
                ],
            },
        ]);

        this.onSelectedDateChanged();
    }

    dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
        const cellDateStr = moment(cellDate).format('YYYY-MM-DD');

        if (this.calendarDateEvents.has(cellDateStr) && view === 'month') {
            return 'highlight-date';
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

        if (this.calendarDateEvents.has(selectedDateStr)) {
            this.events.push(...this.calendarDateEvents.get(selectedDateStr));
        }
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
