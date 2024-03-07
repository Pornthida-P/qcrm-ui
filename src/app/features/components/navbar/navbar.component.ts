import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    faBars,
    faMagnifyingGlass,
    faArrowRightFromBracket,
    faGear,
    faEnvelope,
    faEnvelopeOpen,
    faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Notification } from 'src/app/shared/interface/notification.interface';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService as Translate } from '@ngx-translate/core';
import { TranslateService } from 'src/app/services/translate/translate.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    searchSidebarVisible: boolean = false;
    notificationSidebarVisible: boolean = false;
    notifications: Notification[] = [];
    showReadNotifications: boolean = false;
    unread: boolean = true;
    menuUser: any;
    menuUserNoneSm: any;
    value: string | undefined;
    hideSidebar: boolean = false;
    userData: User | null = null;
    isAction: boolean = false;
    currentLanguage: string = '';
    languages: any[] = [];

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    faBars = faBars;
    faEnvelope = faEnvelope;
    faEnvelopeOpen = faEnvelopeOpen;
    faGlobe = faGlobe;

    constructor(
        private router: Router,
        private userService: UserService,
        private socketIO: SocketIoService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        configPopover: NgbPopoverConfig,
    ) {
        this.currentLanguage = this.translateService.getCurrentLanguage();
        configPopover.autoClose = 'outside';
    }

    ngOnInit() {
        this.getDataUser();
        this.getNotifications();

        this.menuUser = [
            {
                label: 'search',
                icon: faMagnifyingGlass,
                click: () => this.openSearchSideBar(),
            },
            {
                label: 'notification',
                icon: faBell,
                click: () => this.openNotificationSideBar(),
            },
            {
                label: 'setting',
                icon: faGear,
                click: () => this.onClickSetting(),
            },
            {
                label: 'logout',
                icon: faArrowRightFromBracket,
                click: () => this.logout(),
            },
        ];

        this.menuUserNoneSm = [
            {
                label: 'setting',
                icon: faGear,
                click: () => this.onClickSetting(),
            },
            {
                label: 'logout',
                icon: faArrowRightFromBracket,
                click: () => this.logout(),
            },
        ];

        this.languages = [
            {
                label: 'th',
                value: 'th',
            },
            {
                label: 'en',
                value: 'en',
            },
        ];
    }

    getDataUser() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAction = res?.role.roleTitle.toLowerCase() === 'admin' ? true : false;
        });
    }

    openSearchSideBar() {
        this.searchSidebarVisible = true;
    }

    closeSearchSideBar() {
        this.searchSidebarVisible = false;
    }

    openNotificationSideBar() {
        this.findNotificationUnRead();
        this.notificationSidebarVisible = true;
    }

    closeNotificationSideBar() {
        this.notificationSidebarVisible = false;
    }

    onClickSetting() {
        this.router.navigate(['setting']);
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    getStatusOnline(userId?: string): boolean {
        return this.socketIO.getStatusOnline(userId);
    }

    findNotificationUnRead() {
        const userId = this.userData?.userId;
        if (userId) {
            this.notificationService
                .findNotificationUnRead(userId)
                .pipe(
                    tap((res) => {
                        this.notifications = res;
                    }),
                )
                .subscribe(() => {});
        }
    }

    findNotificationRead() {
        const userId = this.userData?.userId;
        if (userId) {
            this.notificationService
                .findNotificationRead(userId)
                .pipe(
                    tap((res) => {
                        const sorted = res.sort((a: any, b: any) => {
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        });

                        this.notifications = sorted;
                    }),
                )
                .subscribe(() => {});
        }
    }

    readAllNotification() {
        this.unread = false;
        if (this.notifications.length > 0) {
            const userId = this.userData?.userId;
            if (userId) {
                this.notificationService.readNotification(userId).subscribe(() => {});
            }
        }
    }

    toggleShowReadNotifications() {
        this.showReadNotifications = !this.showReadNotifications;
        this.getNotifications();
    }

    getNotifications() {
        if (this.showReadNotifications) {
            this.findNotificationRead();
        } else {
            this.findNotificationUnRead();
        }
    }

    formatTimeSinceCreation(createdAt: string): string {
        const now = new Date();
        const diffMs = now.getTime() - new Date(createdAt).getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
    }

    changeLanguage(language: string) {
        this.translateService.setCurrentLanguage(language);
        this.currentLanguage = language;
    }

    logout() {
        this.router.navigate(['logout']);
    }
}
