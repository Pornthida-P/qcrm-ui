import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faCalendarAlt, faXmark } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-menagement-calendar',
    templateUrl: './menagement-calendar.component.html',
    styleUrl: './menagement-calendar.component.scss',
})
export class MenagementCalendarComponent implements OnInit {
    title: string = 'Calendar Event';
    calendarEvent: FormGroup = new FormGroup({});
    members: User[] = [];
    userData: User | null = null;
    selectedMembers: User[] = [];

    profileError: string = '/assets/nea-qcrm-ui/image/profile/user.jpg';

    faXmark = faXmark;
    faCalendar = faCalendarAlt;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private calendarService: CalendarEventService,
        private sweetalertServices: SweetAlertService,
        private cdRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<MenagementCalendarComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; eventData?: CalendarEvent },
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.getUserData();
        this.getMembers();
    }

    initializeForm(): void {
        if (this.data.mode === 'edit' && this.data.eventData) {
            console.log(this.data.eventData);
            this.calendarEvent = this.fb.group({
                eventId: [this.data.eventData.eventId],
                title: [this.data.eventData.title, Validators.required],
                location: [this.data.eventData.location],
                datetime: [new Date(this.data.eventData.datetime).toISOString(), Validators.required],
                description: [this.data.eventData.description, Validators.required],
                members: [[], Validators.required],
            });
        } else {
            this.calendarEvent = this.fb.group({
                eventId: [''],
                title: ['', Validators.required],
                location: [''],
                datetime: [new Date().toISOString(), Validators.required],
                description: ['', Validators.required],
                members: [[], Validators.required],
            });
        }
    }

    getUserData() {
        this.userService.getDataUser().subscribe((user: User | null) => {
            this.userData = user;
        });
    }

    async getMembers() {
        this.userService
            .getAllUser()
            .pipe(
                tap((members) => {
                    this.members = members;

                    if (this.data.mode === 'edit' && this.data.eventData) {
                        this.selectedMembers = members.filter((member) => {
                            return this.data.eventData?.members.some((eventMember) => eventMember.userId === member.userId);
                        });
                        this.calendarEvent.get('members')!.setValue(this.selectedMembers);
                    } else {
                        this.selectedMembers = members.filter((member) => member.userId === this.userData?.userId);
                        this.calendarEvent.get('members')!.setValue(this.selectedMembers);
                    }
                }),
                catchError((error) => {
                    this.handleContactError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    onMemberSelectionChange(event: any): void {
        this.selectedMembers = event.value;
        this.cdRef.detectChanges();
    }

    onSubmit() {
        if (this.calendarEvent.invalid) {
            return;
        }

        const formData = this.calendarEvent.value;
        formData.datetime = moment(formData.datetime).format('YYYY-MM-DD HH:mm:ss');
        formData.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        formData.createdById = this.userData?.userId;

        if (this.data.mode === 'add') {
            this.calendarService
                .addCalendarEvent(formData)
                .pipe(
                    catchError((error) => {
                        this.handleContactError(error);
                        throw error;
                    }),
                )
                .subscribe(() => this.dialogRef.close());
        }

        if (this.data.mode === 'edit') {
            this.calendarService
                .updateCalendarEvent(formData.eventId, formData)
                .pipe(
                    catchError((error) => {
                        this.handleContactError(error);
                        throw error;
                    }),
                )
                .subscribe(() => this.dialogRef.close());
        }
    }

    onClickClose() {
        this.dialogRef.close();
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
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
            case 400:
                icon = 'warning';
                title = 'Calendar Event Error';
                errorMessage = 'Invalid data. Please check your input and try again.';
                route = '';
                break;
            default:
                icon = 'error';
                title = 'Calendar Event Error';
                errorMessage = `Failed to ${this.data.mode} calendar event. Please try again later.`;
                route = '';
                break;
        }

        this.dialogRef.close();
        this.sweetalertServices.getSwal(icon, title, errorMessage, false, route);
    }
}
