import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { faEdit, faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { tap, catchError } from 'rxjs';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { ModalAnnouncementService } from 'src/app/services/modal-announcement/modal-announcement.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { Announce } from 'src/app/shared/interface/announce.interface';
import { MenagementAnnounceComponent } from '../../menagement-announce/menagement-announce.component';
import { User } from 'src/app/shared/interface/user.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'app-menagement-announce-list',
    templateUrl: './menagement-announce-list.component.html',
    styleUrl: './menagement-announce-list.component.scss',
})
export class MenagementAnnounceListComponent implements OnInit {
    title: string = 'Announcement Management';
    announcements: Announce[] = [];

    faXmark = faXmark;
    faEye = faEye;
    faEdit = faEdit;

    dataUser?: User | null;
    isAction: boolean = false;

    constructor(
        private userService: UserService,
        private announcementService: AnnouncementService,
        private sweetalertServices: SweetAlertService,
        private modalAnnouncementService: ModalAnnouncementService,
        public dialogRef: MatDialogRef<MenagementAnnounceComponent>,
    ) {}

    ngOnInit(): void {
        this.announcementService.onRefreshData().subscribe(() => {
            this.findAllAnnouncement();
        });

        this.getDataUser();
    }

    findAllAnnouncement() {
        this.announcementService
            .findAll()
            .pipe(
                tap((res: Announce[]) => {
                    this.announcements = res;
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    getDataUser() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.dataUser = res;
            this.isAction = res?.role.roleTitle.toLowerCase() === 'admin' ? true : false;
        });
    }

    onClickClose() {
        this.dialogRef.close();
    }

    onSubmit() {
        this.dialogRef.close();
    }

    onClickAddAnnounce() {
        this.modalAnnouncementService.openDialog('add');
    }

    onClickEditAnnounce(announce: Announce) {
        this.modalAnnouncementService.openDialog('edit', announce);
    }

    onClickViewAnnounce(announce: Announce) {
        this.modalAnnouncementService.openDialog('view', announce);
    }

    onClickDeleteAnnounce(announce: Announce) {
        this.announcementService
            .delete(announce.announceId.toString())
            .pipe(
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }
}
