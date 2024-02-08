import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faCalendarAlt, faPaperclip, faPlusCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { Attachment } from 'src/app/shared/interface/attachment.interface';
import { CalendarEvent, CalendarTag } from 'src/app/shared/interface/calendar.interface';
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
    attachments: Attachment[] = [];
    tags: CalendarTag[] = [];

    @ViewChild('fileInput') fileInput: ElementRef | undefined;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    faXmark = faXmark;
    faCalendar = faCalendarAlt;
    faAttachment = faPaperclip;
    faPlus = faPlusCircle;

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '150px',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        showToolbar: true,
        placeholder: '',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' },
        ],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText',
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['font'],
            ['insertHorizontalRule'],
            ['removeFormat'],
            ['toggleEditor'],
            ['backgroundColor'],
            ['customClasses'],
        ],
    };

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private calendarService: CalendarEventService,
        private attachmentService: AttachmentService,
        private sweetalertServices: SweetAlertService,
        private cdRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<MenagementCalendarComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; eventData?: CalendarEvent },
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.getAllTags();
        this.getUserData();
        this.getMembers();
    }

    initializeForm(): void {
        const isViewMode = this.data.mode === 'view';

        if (this.data.mode === 'add') {
            this.calendarEvent = this.fb.group({
                eventId: [],
                title: ['', Validators.required],
                tag: ['', Validators.required],
                location: [''],
                startDate: [new Date().toISOString(), Validators.required],
                endDate: [new Date().toISOString(), Validators.required],
                description: [, Validators.required],
                members: [[], Validators.required],
            });
        } else {
            this.calendarEvent = this.fb.group({
                eventId: [{ value: this.data.eventData?.eventId, disabled: isViewMode }],
                title: [{ value: this.data.eventData?.title, disabled: isViewMode }, Validators.required],
                tag: [{ value: this.data.eventData?.tag.tagId, disabled: isViewMode }, Validators.required],
                location: [{ value: this.data.eventData?.location, disabled: isViewMode }],
                startDate: [
                    { value: new Date(this.data.eventData?.startDate || '').toISOString(), disabled: isViewMode },
                    Validators.required,
                ],
                endDate: [{ value: new Date(this.data.eventData?.endDate || '').toISOString(), disabled: isViewMode }, Validators.required],
                description: [{ value: this.data.eventData?.description, disabled: isViewMode }, Validators.required],
                members: [{ value: [], disabled: isViewMode }, Validators.required],
            });
        }

        this.attachments = [...(this.data.eventData?.attachments || [])];
    }

    getUserData() {
        this.userService.getDataUser().subscribe((user: User | null) => {
            this.userData = user;
        });
    }

    getAllTags() {
        this.calendarService
            .findAllTags()
            .pipe(
                tap((tags) => {
                    this.tags = tags;
                }),
                catchError((error) => {
                    this.handleContactError(error);
                    throw error;
                }),
            )
            .subscribe();
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
            this.sweetalertServices.getSwal('warning', 'Warning', 'Please fill in all required fields.', false, '');
            return;
        }

        const formData = this.calendarEvent.value;
        const startDateTime = moment(formData.startDate);
        const endDateTime = moment(formData.endDate);

        if (!startDateTime.isBefore(endDateTime)) {
            this.sweetalertServices.getSwal('warning', 'Warning', 'Start date must be before end date.', false, '');
            return;
        }

        formData.startDate = moment(formData.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        formData.endDate = moment(formData.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        formData.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        formData.createdById = this.userData?.userId;
        formData.attachments = this.attachments;

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
            if (!formData.eventId) {
                this.sweetalertServices.getSwal('warning', 'Warning', 'Invalid data. Please check your input and try again.', false, '');
                return;
            }

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

    onFileSelected(event: any) {
        const file = event.target.files[0];
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        this.attachmentService
            .upload(file, file.name, createdAt, this.userData?.userId || '')
            .pipe(
                tap((response: any) => {
                    console.log('Attachment response:', response);
                    this.attachments.push(response);
                }),
                catchError((error) => {
                    this.handleContactError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    openFileInput() {
        if (this.fileInput) {
            this.fileInput.nativeElement.click();
        }
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    onDeletedMember(userId: string) {
        this.selectedMembers = this.selectedMembers.filter((member) => member.userId !== userId);
        this.calendarEvent.get('members')!.setValue(this.selectedMembers);
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
