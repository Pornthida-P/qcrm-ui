import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { Announce } from 'src/app/shared/interface/announce.interface';

@Component({
    selector: 'app-menagement-announce-list',
    templateUrl: './menagement-announce-list.component.html',
    styleUrl: './menagement-announce-list.component.scss',
})
export class MenagementAnnounceListComponent implements OnInit {
    title: string = 'Announcement Management';
    announceData: FormGroup = new FormGroup({});

    faXmark = faXmark;

    constructor(
        private announcementService: AnnouncementService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<MenagementAnnounceListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; announcement?: Announce },
    ) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    onClickClose() {
        this.dialogRef.close();
    }

    onSubmit() {
        console.log('submit');
    }

    handleAnnounceError(error: any) {}

    initializeForm(): void {
        if (this.data.mode === 'add') {
            this.announceData = this.fb.group({
                announceId: [],
                annoinceTitle: [],
                description: [],
                startDate: [],
                endDate: [],
                createdAt: [],
                createdById: [],
                modifiedAt: [],
                modifiedById: [],
            });
        } else {
            this.announceData = this.fb.group({
                announceId: [this.data.announcement?.announceId],
                announceTitle: [this.data.announcement?.announceTitle],
                description: [this.data.announcement?.description],
                startDate: [this.data.announcement?.startDate],
                endDate: [this.data.announcement?.endDate],
                createdAt: [this.data.announcement?.createdAt],
                createdById: [this.data.announcement?.createdById],
                modifiedAt: [this.data.announcement?.modifiedAt],
                modifiedById: [this.data.announcement?.modifiedById],
            });
        }
    }
}
