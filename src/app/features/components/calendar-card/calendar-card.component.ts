import { Component, Input, OnInit } from '@angular/core';
import { faCalendarAlt, faList, faLocationDot, faUserGroup, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { catchError, tap } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';

@Component({
    selector: 'app-calendar-card',
    templateUrl: './calendar-card.component.html',
    styleUrl: './calendar-card.component.scss',
})
export class CalendarCardComponent implements OnInit {
    @Input() event?: CalendarEvent;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    faCalendar = faCalendarAlt;
    faList = faList;
    faLocation = faLocationDot;
    faUserGroup = faUserGroup;
    faEdit = faEdit;
    faTrash = faTrash;

    constructor(
        private modalCalendarService: ModalCalendarService,
        private calendarService: CalendarEventService,
        private sweetalertServices: SweetAlertService,
    ) {}

    ngOnInit(): void {}

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    onClickEditEvent(event: CalendarEvent | undefined) {
        if (event && event?.eventId) {
            this.modalCalendarService.openDialog('edit', event);
        }
    }

    onClickDeleteEvent(event: CalendarEvent | undefined) {
        if (event && event?.eventId) {
            this.calendarService
                .deleteCalendarEvent(event.eventId.toString())
                .pipe(
                    catchError((error) => {
                        this.handleContactError(error);
                        throw error;
                    }),
                )
                .subscribe(() => {});
        }
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
                errorMessage = 'Failed to update calendar event. Please try again later.';
                route = '';
                break;
        }

        this.sweetalertServices.getSwal(icon, title, errorMessage, false, route);
    }
}
