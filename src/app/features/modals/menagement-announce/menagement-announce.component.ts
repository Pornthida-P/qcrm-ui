import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faEdit, faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { catchError, tap } from 'rxjs';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { ModalAnnouncementService } from 'src/app/services/modal-announcement/modal-announcement.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { Announce } from 'src/app/shared/interface/announce.interface';

@Component({
    selector: 'app-menagement-announce',
    templateUrl: './menagement-announce.component.html',
    styleUrl: './menagement-announce.component.scss',
})
export class MenagementAnnounceComponent implements OnInit {
    title: string = 'Announcement Management';
    announcements: Announce[] = [];

    faXmark = faXmark;
    faEye = faEye;
    faEdit = faEdit;

    constructor(
        private announcementService: AnnouncementService,
        private sweetalertServices: SweetAlertService,
        private modalAnnouncementService: ModalAnnouncementService,
        public dialogRef: MatDialogRef<MenagementAnnounceComponent>,
    ) {}

    ngOnInit(): void {
        this.findAllAnnouncement();
    }

    findAllAnnouncement() {
        this.announcementService
            .findAll()
            .pipe(
                tap((res: Announce[]) => {
                    this.announcements = res;
                }),
                catchError((error) => {
                    this.handleAnnounceError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    onClickClose() {
        this.dialogRef.close();
    }

    onSubmit() {
        console.log('submit');
    }

    onClickEditAnnounce(announce: Announce) {
        this.modalAnnouncementService.openDialog('edit', announce);
    }

    onClickViewAnnounce(announce: Announce) {
        this.modalAnnouncementService.openDialog('view', announce);
    }

    onClickDeleteAnnounce(announce: Announce) {
        console.log('delete');
    }

    handleAnnounceError(error: any) {
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
                title = 'Announce Error';
                errorMessage = `Failed to update announcement. Please try again later.`;
                route = '';
                break;
        }

        this.dialogRef.close();
        this.sweetalertServices.getSwal(icon, title, errorMessage, false, route);
    }
}
