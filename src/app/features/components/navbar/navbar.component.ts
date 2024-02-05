import { Component, OnInit } from '@angular/core';
import { faBars, faMagnifyingGlass, faArrowRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    searchSidebarVisible: boolean = false;
    notificationSidebarVisible: boolean = false;
    menuUser: any;
    menuUserNoneSm: any;
    value: string | undefined;
    hideSidebar: boolean = false;
    userData: User | null = null;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    faBars = faBars;

    constructor(private router: Router, private userService: UserService) {}

    ngOnInit() {
        this.getUserData();

        this.menuUser = [
            {
                label: 'ค้นหา',
                icon: faMagnifyingGlass,
                click: () => this.openSearchSideBar(),
            },
            {
                label: 'การแจ้งเตือน',
                icon: faBell,
                click: () => this.openNotificationSideBar(),
            },
            {
                label: 'ตั้งค่า',
                icon: faGear,
                click: () => this.onClickSetting(),
            },
            {
                label: 'ออกจากระบบ',
                icon: faArrowRightFromBracket,
                click: () => this.logout(),
            },
        ];

        this.menuUserNoneSm = [
            {
                label: 'ตั้งค่า',
                icon: faGear,
                click: () => this.onClickSetting(),
            },
            {
                label: 'ออกจากระบบ',
                icon: faArrowRightFromBracket,
                click: () => this.logout(),
            },
        ];
    }

    getUserData() {
        this.userService.getDataUser().subscribe((user: User | null) => {
            this.userData = user;
        });

        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.hideSidebar = event.url.includes('/setting');
            });
    }

    openSearchSideBar() {
        this.searchSidebarVisible = true;
        console.log(this.searchSidebarVisible);
    }

    closeSearchSideBar() {
        this.searchSidebarVisible = false;
    }

    openNotificationSideBar() {
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

    logout() {
        this.router.navigate(['login']);
    }
}
