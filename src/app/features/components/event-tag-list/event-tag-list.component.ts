import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import {
    faCalendarAlt,
    faList,
    faLocationDot,
    faUserGroup,
    faEdit,
    faTrash,
    faTag,
    faPaperclip,
    faEye,
} from '@fortawesome/free-solid-svg-icons';
import { catchError } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-event-tag-list',
    templateUrl: './event-tag-list.component.html',
    styleUrl: './event-tag-list.component.scss',
})
export class EventTagListComponent {
    @Input() event?: CalendarEvent;
    @Input() isBorder: boolean = true;
    @Input() isAction: boolean = false;

    @Output() viewEvent: EventEmitter<void> = new EventEmitter();
    @Output() isDeleteEvent: EventEmitter<boolean> = new EventEmitter();

    @Output() viewMember: EventEmitter<User> = new EventEmitter<User>();
    @Output() editMember: EventEmitter<User> = new EventEmitter<User>();
    @Output() deleteMember: EventEmitter<User> = new EventEmitter<User>();

    userData?: User | null;
    // isAction: boolean = false;
    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    faCalendar = faCalendarAlt;
    faTag = faTag;
    faList = faList;
    faLocation = faLocationDot;
    faUserGroup = faUserGroup;
    faView = faEye;
    faEdit = faEdit;
    faTrash = faTrash;
    faPaperclip = faPaperclip;

    positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
    position = new FormControl(this.positionOptions[0]);

    constructor(
        private userService: UserService,
        private modalCalendarService: ModalCalendarService,
        private calendarService: CalendarEventService,
        private sweetalertServices: SweetAlertService,
    ) {}

    ngOnInit(): void {
        this.getDataUser();
    }

    getDataUser() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAction = res?.role.roleTitle.toLowerCase() === 'admin';
        });
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    onClickEditEvent(event: CalendarEvent) {
            this.modalCalendarService.openDialog('edit', event);
    }

    onClickDeleteEvent(event: CalendarEvent) {
        this.isDeleteEvent.emit(true)
        this.calendarService
            .deleteCalendarEvent(event.eventId.toString())
            .pipe(
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    onClickViewMember(member: User) {
        this.viewMember.emit(member);
    }

    onClickEditMember(member: User) {
        this.editMember.emit(member);
    }

    onClickDeletedMember(member: User) {
        this.deleteMember.emit(member);
    }

    isNewCard(startDateStr: string): boolean {
        const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
        const startDate = new Date(startDateStr);
        const currentDate = new Date();
        return currentDate.getTime() - startDate.getTime() <= twentyFourHoursInMilliseconds;
    }
}
