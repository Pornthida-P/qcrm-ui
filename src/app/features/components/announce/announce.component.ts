import { Component } from '@angular/core';
import { faBullhorn, faEdit } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { ModalAnnouncementService } from 'src/app/services/modal-announcement/modal-announcement.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { Announce } from 'src/app/shared/interface/announce.interface';

@Component({
    selector: 'app-announce',
    templateUrl: './announce.component.html',
    styleUrl: './announce.component.scss',
})
export class AnnounceComponent {
    faAnnounce = faBullhorn;

    announcements: Announce[] = [];

    marqueeText = '';

    faEdit = faEdit;

    constructor(
        private modalAnnouncementService: ModalAnnouncementService,
        private announcementService: AnnouncementService,
        private sweetalertServices: SweetAlertService,
    ) {}

    ngOnInit(): void {
        this.announcementService.onRefreshData().subscribe(() => {
            this.findAnnounceByDate();
        });
    }

    findAnnounceByDate() {
        const date = moment().format('YYYY-MM-DD');
        this.announcementService
            .findByDate(date)
            .pipe(
                tap((res: Announce[]) => {
                    this.announcements = res;
                    this.updateMarqueeText();
                }),
                catchError((error) => {
                    this.handleAnnounceError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    updateMarqueeText() {
        if (this.announcements.length > 0) {
            this.marqueeText = this.announcements
                .map((announce, index, array) => {
                    if (index < array.length - 1) {
                        return `<strong>${announce.announceTitle}</strong> : ${announce.description} <span class="marquee-space"></span>`;
                    } else {
                        return `<strong>${announce.announceTitle}</strong> : ${announce.description}`;
                    }
                })
                .join('');
        } else {
            this.marqueeText = '';
        }
    }

    onClickEditAnnounce() {
        this.modalAnnouncementService.openDialogList('edit');
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
                title = 'Announcement Error';
                errorMessage = 'Failed to update announcement. Please try again later.';
                route = '';
                break;
        }

        this.sweetalertServices.getSwal(icon, title, errorMessage, false, route);
    }
}
