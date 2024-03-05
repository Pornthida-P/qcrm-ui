import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faBullhorn, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { Announce } from 'src/app/shared/interface/announce.interface';
import { User } from 'src/app/shared/interface/user.interface';
import { TranslateService } from '@ngx-translate/core';

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
        private announcementService: AnnouncementService,
        private sweetalertServices: SweetAlertService,
        private router: Router,
        private translateService: TranslateService,
    ) {
        translateService.setDefaultLang('th');
    }

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
                        return `<p class="m-0"><strong class="color-red">${announce.announceTitle}</strong> : ${announce.description}</p> <span class="marquee-space"></span>`;
                    } else {
                        return `<p class="m-0"><strong class="color-red">${announce.announceTitle}</strong> : ${announce.description}</p>`;
                    }
                })
                .join('');
        } else {
            this.marqueeText = '';
        }
    }

    onClickView() {
        this.router.navigate(['/announcement-page']);
    }
}
