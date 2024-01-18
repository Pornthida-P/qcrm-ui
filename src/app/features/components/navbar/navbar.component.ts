import { Component } from '@angular/core';
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
} from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
    items: any;
    activeMenu!: string;
    sidebarVisible: boolean = false;
    faBars = faBars;
    faBell = faBell;
    searchSidebarVisible: boolean = false;
    notificationSidebarVisible: boolean = false;
    menus: MenuItem[] | undefined;
    value: string | undefined;

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
                routerLink: '/survey/form',
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

        this.menus = [
            {
                label: 'Gannaphat',
                items: [
                    {
                        label: 'ค้นหา',
                        icon: 'pi pi-search',
                        command: () => {
                            this.openSearchSideBar();
                        },
                    },
                    {
                        label: 'การแจ้งเตือน',
                        icon: 'pi pi-bell',
                        command: () => {
                            this.opennotificationSideBar();
                        },
                    },
                    {
                        label: 'ออกจากระบบ',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            this.logout();
                        },
                    },
                ],
            },
        ];
    }

    setActiveMenu(menu: string) {
        this.activeMenu = menu;
        this.sidebarVisible = false;
    }

    openSearchSideBar() {
        this.searchSidebarVisible = true;
    }

    opennotificationSideBar() {
        this.notificationSidebarVisible = true;
    }

    logout() {
        console.log('logout');
    }
}
