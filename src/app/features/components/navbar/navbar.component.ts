import { Component, HostListener, OnInit } from '@angular/core';
import {
    faChartColumn,
    faFileLines,
    faComments,
    faFilePen,
    faPhoneVolume,
    faBookOpen,
    faLayerGroup,
    faBagShopping,
    faBars,
    faMagnifyingGlass,
    faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    items: any;
    activeMenu!: string;
    sidebarVisible: boolean = false;
    faBars = faBars;
    searchSidebarVisible: boolean = false;
    notificationSidebarVisible: boolean = false;
    menuUser: any;
    menuUserNoneSm: any;
    value: string | undefined;
    currentPath!: string;

    constructor(private router: Router) {}

    ngOnInit() {
        this.items = [
            {
                label: 'หน้าแรก',
                icon: faChartColumn,
                routerLink: '/home',
            },
            {
                label: 'ฐานข้อมูลผู้ติดต่อ',
                icon: faFileLines,
                routerLink: '/contacts',
            },
            {
                label: 'การติดตามและประเมินผล',
                icon: faComments,
                routerLink: '/survey',
            },
            {
                label: 'แบบฟอร์มสำรวจ',
                icon: faFilePen,
                routerLink: '/surveyform',
            },
            {
                label: 'การโทร',
                icon: faPhoneVolume,
                routerLink: '/call',
            },
            {
                label: 'หลักสูตร E-Learning',
                icon: faBookOpen,
                routerLink: '/e-learning',
            },
            {
                label: 'โครงการอบรม / สัมนา',
                icon: faLayerGroup,
                routerLink: '/training',
            },
            {
                label: 'ประเภทสินค้า',
                icon: faBagShopping,
                routerLink: '/products',
            },
        ];
        this.activeMenu = this.items[0].label;

        this.currentPath = this.router.url;

        if (this.currentPath && this.items) {
            const menuItem = this.items.find((i: any) => i.routerLink === this.currentPath);
            if (menuItem) {
                this.activeMenu = menuItem.label;
            } else {
                this.activeMenu = this.items.find(
                    (i: any) => `${i.routerLink}/new` === this.currentPath || `${i.routerLink}/edit` === this.currentPath,
                ).label;
            }
        }

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
                label: 'ออกจากระบบ',
                icon: faArrowRightFromBracket,
                click: () => this.logout(),
            },
        ];

        this.menuUserNoneSm = [
            {
                label: 'ออกจากระบบ',
                icon: faArrowRightFromBracket,
                click: () => this.logout(),
            },
        ];
    }

    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
        const currentPath = event.currentTarget.location.pathname;

        if (currentPath && this.items) {
            const menuItem = this.items.find((i: any) => i.routerLink === this.currentPath);
            if (menuItem) {
                this.activeMenu = menuItem.label;
            } else {
                this.activeMenu = this.items.find(
                    (i: any) => `${i.routerLink}/new` === this.currentPath || `${i.routerLink}/edit` === this.currentPath,
                ).label;
            }
        }
    }

    setActiveMenu(menu: string) {
        this.activeMenu = menu;
        this.sidebarVisible = false;
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

    logout() {
        console.log('logout');
    }
}
