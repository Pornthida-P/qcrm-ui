import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { Announce } from 'src/app/shared/interface/announce.interface';
import { MenagementAnnounceListComponent } from '../menagement-announce-list/menagement-announce-list/menagement-announce-list.component';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { catchError, tap } from 'rxjs';
import { User } from 'src/app/shared/interface/user.interface';
import { UserService } from 'src/app/services/user/user.service';
import * as moment from 'moment';

@Component({
    selector: 'app-menagement-announce',
    templateUrl: './menagement-announce.component.html',
    styleUrl: './menagement-announce.component.scss',
})
export class MenagementAnnounceComponent implements OnInit {
    title: string = 'Announcement Management';
    announceData: FormGroup = new FormGroup({});
    startTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
    endTime: NgbTimeStruct = { hour: 23, minute: 59, second: 59 };
    userData?: User | null;
    isAction: boolean = false;

    faXmark = faXmark;

    constructor(
        private announcementService: AnnouncementService,
        private fb: FormBuilder,
        private userService: UserService,
        private sweetalertServices: SweetAlertService,
        public dialogRef: MatDialogRef<MenagementAnnounceListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; announcement?: Announce },
    ) {
        if (data.announcement?.startDate) {
            const startDate = new Date(data.announcement.startDate);
            const hour = startDate.getHours();
            const minute = startDate.getMinutes();
            const second = startDate.getSeconds();
            this.startTime = { hour, minute, second };
        }

        if (data.announcement?.endDate) {
            const endDate = new Date(data.announcement.endDate);
            const hour = endDate.getHours();
            const minute = endDate.getMinutes();
            const second = endDate.getSeconds();
            this.endTime = { hour, minute, second };
        }
    }

    ngOnInit(): void {
        this.getUserData();
        this.initializeForm();
    }

    getUserData() {
        this.userService
            .getDataUser()
            .pipe(
                tap((res: User | null) => {
                    this.userData = res;
                    this.isAction = res?.role.roleTitle.toLocaleLowerCase() === 'admin' ? true : false;
                }),
            )
            .subscribe();
    }

    onClickClose() {
        this.dialogRef.close();
    }

    onSubmit() {
        if (this.announceData.invalid) {
            this.sweetalertServices.getSwal('warning', 'Warning', 'Please fill in all required fields.', false, '');
            return;
        }

        const form = this.announceData.value;

        const startDate = moment(form.startDate).set({
            hour: this.startTime.hour,
            minute: this.startTime.minute,
            second: this.startTime.second,
        });

        const endDate = moment(form.endDate).set({
            hour: this.endTime.hour,
            minute: this.endTime.minute,
            second: this.endTime.second,
        });

        form.startDate = startDate.format('YYYY-MM-DD HH:mm:ss');
        form.endDate = endDate.format('YYYY-MM-DD HH:mm:ss');

        if (!startDate.isBefore(endDate)) {
            this.sweetalertServices.getSwal('warning', 'Warning', 'Start date must be before end date.', false, '');
            return;
        }

        if (this.data.mode === 'add') {
            form.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
            form.createdById = this.userData?.userId;

            this.announcementService
                .add(form)
                .pipe(
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        throw error;
                    }),
                )
                .subscribe((res) => {
                    this.dialogRef.close();
                });
        } else if (this.data.mode === 'edit') {
            form.modifiedAt = moment().format('YYYY-MM-DD HH:mm:ss');
            form.modifiedById = this.userData?.userId;

            this.announcementService
                .update(form)
                .pipe(
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        throw error;
                    }),
                )
                .subscribe((res) => {
                    this.dialogRef.close();
                });
        }
    }

    initializeForm(): void {
        const isViewMode = this.data.mode === 'view';

        if (this.data.mode === 'add') {
            this.announceData = this.fb.group({
                announceId: [],
                announceTitle: ['', Validators.required],
                description: ['', Validators.required],
                startDate: [new Date(), Validators.required],
                endDate: [new Date(), Validators.required],
                createdAt: [],
                createdById: [],
                modifiedAt: [],
                modifiedById: [],
            });
        } else {
            this.announceData = this.fb.group({
                announceId: [{ value: this.data.announcement?.announceId, disabled: isViewMode }],
                announceTitle: [{ value: this.data.announcement?.announceTitle, disabled: isViewMode }, [Validators.required]],
                description: [{ value: this.data.announcement?.description, disabled: isViewMode }, [Validators.required]],
                startDate: [{ value: this.data.announcement?.startDate, disabled: isViewMode }, [Validators.required]],
                endDate: [{ value: this.data.announcement?.endDate, disabled: isViewMode }, [Validators.required]],
                createdAt: [{ value: this.data.announcement?.createdAt, disabled: isViewMode }],
                createdById: [{ value: this.data.announcement?.createdById, disabled: isViewMode }],
                modifiedAt: [{ value: this.data.announcement?.modifiedAt, disabled: isViewMode }],
                modifiedById: [{ value: this.data.announcement?.modifiedById, disabled: isViewMode }],
            });
        }
    }
}
