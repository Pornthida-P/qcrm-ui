import { Component, Input, OnInit } from '@angular/core';
import { faCalendarAlt, faList, faLocationDot, faUserGroup, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
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

    constructor(private modalCalendarService: ModalCalendarService) {}

    ngOnInit(): void {}

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    onClickEditEvent(event: CalendarEvent | undefined) {
        if (event) {
            this.modalCalendarService.openDialog('edit', event);
        }
    }

    onClickDeleteEvent() {
        console.log(`Delete Event`);
    }
}
