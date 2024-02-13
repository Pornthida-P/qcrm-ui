import { Component } from '@angular/core';
import { faBullhorn, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { ModalAnnouncementService } from 'src/app/services/modal-announcement/modal-announcement.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { Announce } from 'src/app/shared/interface/announce.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-announce',
    templateUrl: './announce.component.html',
    styleUrl: './announce.component.scss',
})
export class AnnounceComponent {
    faAnnounce = faBullhorn;
    faEye = faEye;

    dataUser?: User | null;
    isAction: boolean = false;
    announcements: Announce[] = [];

    marqueeText = '';

    faEdit = faEdit;

    constructor(
        private userService: UserService,
        private modalAnnouncementService: ModalAnnouncementService,
        private announcementService: AnnouncementService,
        private sweetalertServices: SweetAlertService,
    ) {}

    ngOnInit(): void {
        this.announcementService.onRefreshData().subscribe(() => {
            this.findAnnounceByDate();
        });

        this.getDataUser();
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

    onClickView() {
        this.modalAnnouncementService.openDialogList('view');
    }

    onClickEdit() {
        this.modalAnnouncementService.openDialogList('edit');
    }
}
