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
    }

    setActiveMenu(menu: string) {
        this.activeMenu = menu;
        this.sidebarVisible = false;
    }
}
