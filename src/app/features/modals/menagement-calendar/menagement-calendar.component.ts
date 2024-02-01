import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faCalendarAlt, faXmark } from '@fortawesome/free-solid-svg-icons';
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
        private cdRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<MenagementCalendarComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; eventData?: CalendarEvent },
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.getUserData();

        this.members = [
            { userId: '1', username: 'admin', email: 'admin@convergence.co.th', profile: '', group: 'developer', role: 'admin' },
            { userId: '2', username: 'Jon Doe', email: 'jondoe@convergence.co.th', profile: '', group: 'developer', role: 'agent' },
        ];

        this.selectedMembers = this.members.filter((member) => member?.userId === this.userData?.userId);
        this.calendarEvent.get('members')!.setValue(this.selectedMembers);
    }

    initializeForm(): void {
        if (this.data.mode === 'edit' && this.data.eventData) {
            this.calendarEvent = this.fb.group({
                title: [this.data.eventData.title, Validators.required],
                location: [this.data.eventData.location],
                datetime: [this.data.eventData.datetime, Validators.required],
                description: [this.data.eventData.description],
                members: [new FormControl(this.data.eventData.members)],
            });
        } else {
            this.calendarEvent = this.fb.group({
                title: ['', Validators.required],
                location: [''],
                datetime: [new Date(), Validators.required],
                description: [''],
                members: [new FormControl()],
            });
        }
    }

    getUserData() {
        this.userService.getDataUser().subscribe((user: User | null) => {
            this.userData = user;
        });
    }

    onMemberSelectionChange(event: any): void {
        this.selectedMembers = event.value;
        this.cdRef.detectChanges();
    }

    onSubmit() {
        if (this.calendarEvent.invalid) {
            return;
        }

        console.log(this.calendarEvent.value);
    }

    onClickClose() {
        this.dialogRef.close();
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
