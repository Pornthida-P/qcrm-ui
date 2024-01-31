import { Component, Input, OnInit } from '@angular/core';
import { faCalendarAlt, faList, faLocationDot, faUserGroup, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';

@Component({
    selector: 'app-calendar-card',
    templateUrl: './calendar-card.component.html',
    styleUrl: './calendar-card.component.scss',
})
export class CalendarCardComponent implements OnInit {
    @Input() event?: CalendarEvent;

    profileError: string = '/assets/nea-qcrm-ui/image/profile/user.jpg';

    faCalendar = faCalendarAlt;
    faList = faList;
    faLocation = faLocationDot;
    faUserGroup = faUserGroup;
    faEdit = faEdit;
    faTrash = faTrash;

    ngOnInit(): void {}

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
