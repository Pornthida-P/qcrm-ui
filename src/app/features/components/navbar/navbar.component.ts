import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    faBars,
    faMagnifyingGlass,
    faArrowRightFromBracket,
    faGear,
    faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
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
    menuUser: any;
    menuUserNoneSm: any;
    value: string | undefined;
    hideSidebar: boolean = false;
    userData: User | null = null;
    isAction: boolean = false;
    currentLanguage: string = '';
    languages: any[] = [];

    profileError: string = './assets/qcrm-ui/image/profile/user.jpg';

    faBars = faBars;
    faGlobe = faGlobe;

    constructor(
        private router: Router,
        private userService: UserService,
        private socketIO: SocketIoService,
        private translateService: TranslateService,
        configPopover: NgbPopoverConfig,
    ) {
        this.currentLanguage = this.translateService.getCurrentLanguage();
        configPopover.autoClose = 'outside';
    }

    ngOnInit() {
        this.getDataUser();

        this.menuUser = [
            {
                label: 'search',
                icon: faMagnifyingGlass,
                click: () => this.openSearchSideBar(),
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

    changeLanguage(language: string) {
        this.translateService.setCurrentLanguage(language);
        this.currentLanguage = language;
    }

    logout() {
        this.router.navigate(['logout']);
    }
}
