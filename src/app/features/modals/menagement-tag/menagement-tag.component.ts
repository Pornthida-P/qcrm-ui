import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { tap } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarTag } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-menagement-tag',
    templateUrl: './menagement-tag.component.html',
    styleUrl: './menagement-tag.component.scss',
})
export class MenagementTagComponent implements OnInit {
    title: string = 'menagement-tag';
    tagData: FormGroup = new FormGroup({});
    userData: User | null = null;
    isAction: boolean = false;

    faXmark = faXmark;
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private sweetalertServices: SweetAlertService,
        private calendarService: CalendarEventService,
        private translateService: TranslateService,
        public dialogRef: MatDialogRef<MenagementTagComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; tag?: CalendarTag },
    ) {
        translateService.setDefaultLang('th');
    }

    ngOnInit(): void {
        this.initzaion();
    }

    initzaion(): void {
        this.getUserData();
        this.initializeForm();
    }

    getUserData() {
        this.userService
            .getDataUser()
            .pipe(
                tap((res: User | null) => {
                    this.userData = res;
                    this.isAction = res?.role.roleTitle.toLowerCase() === 'admin' ? true : false;
                }),
            )
            .subscribe();
    }

    initializeForm(): void {
        const isViewMode = this.data.mode === 'view';

        if (this.data.mode === 'add') {
            this.tagData = this.fb.group({
                tagId: [{ value: '', disabled: isViewMode }],
                tagName: [{ value: '', disabled: isViewMode }, [Validators.required]],
                description: [{ value: '', disabled: isViewMode }, [Validators.required]],
                color: [{ value: '', disabled: isViewMode }, [Validators.required]],
                createdAt: [{ value: '', disabled: isViewMode }],
                createdById: [{ value: '', disabled: isViewMode }],
                modifyAt: [{ value: '', disabled: isViewMode }],
                modifyById: [{ value: '', disabled: isViewMode }],
            });
        } else {
            this.tagData = this.fb.group({
                tagId: [{ value: this.data.tag?.tagId, disabled: isViewMode }],
                tagName: [{ value: this.data.tag?.tagName, disabled: isViewMode }, [Validators.required]],
                description: [{ value: this.data.tag?.description, disabled: isViewMode }, [Validators.required]],
                color: [{ value: this.data.tag?.color, disabled: isViewMode }, [Validators.required]],
                createdAt: [{ value: this.data.tag?.createdAt, disabled: isViewMode }],
                createdById: [{ value: this.data.tag?.createdById, disabled: isViewMode }],
                modifyAt: [{ value: this.data.tag?.modifyAt, disabled: isViewMode }],
                modifyById: [{ value: this.data.tag?.modifyById, disabled: isViewMode }],
            });
        }
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.tagData.invalid) {
            this.sweetalertServices.getSwal('warning', 'warning', 'Please fill in the required fields.', false, '');
            return;
        }

        const tagData: CalendarTag = {
            tagId: this.tagData.get('tagId')?.value,
            tagName: this.tagData.get('tagName')?.value,
            description: this.tagData.get('description')?.value,
            color: this.tagData.get('color')?.value,
        };

        if (this.data.mode === 'add') {
            const createdAt = moment().format('YYYY-MM-DDTHH:mm:ss');
            const createdById = this.userData?.userId;

            this.calendarService
                .addCalendarTag({ ...tagData, createdAt, createdById })
                .pipe(
                    tap(() => {
                        this.sweetalertServices.getSwal('success', 'success', 'Tag added successfully', false, '');
                        this.dialogRef.close(tagData);
                    }),
                )
                .subscribe(() => {});
        } else if (this.data.mode === 'edit') {
            const modifyAt = moment().format('YYYY-MM-DDTHH:mm:ss');
            const modifyById = this.userData?.userId;

            this.calendarService
                .updateCalendarTag({ ...tagData, modifyAt, modifyById })
                .pipe(
                    tap(() => {
                        this.sweetalertServices.getSwal('success', 'success', 'Tag updated successfully', false, '');
                        this.dialogRef.close(tagData);
                    }),
                )
                .subscribe(() => {});
        }
    }
}
