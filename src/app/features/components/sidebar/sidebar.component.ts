import { Component, OnInit } from '@angular/core';
import {
    faBagShopping,
    faBookOpen,
    faChartColumn,
    faComments,
    faFileLines,
    faFilePen,
    faLayerGroup,
    faPhoneVolume,
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
    items: any = [];

    constructor() {}

    ngOnInit(): void {
        this.items = [
            {
                label: 'หน้าแรก',
                icon: faChartColumn,
                routerLink: '/home',
            },
            {
                label: 'ฐานข้อมูลผู้ใช้บริการและประวัติผู้ติดต่อ',
                icon: faFileLines,
                routerLink: '/contacts',
            },
            // {
            //     label: 'แบบฟอร์มสำรวจและติดตามประเมินผล',
            //     icon: faComments,
            //     routerLink: '/survey',
            // },
            {
                label: 'แบบฟอร์มสำรวจและติดตามประเมินผล',
                icon: faFilePen,
                routerLink: '/surveyform',
            },
            {
                label: 'ประวัติการโทร',
                icon: faPhoneVolume,
                routerLink: '/call',
            },
            // {
            //     label: 'หลักสูตร E-Learning',
            //     icon: faBookOpen,
            //     routerLink: '/e-learning',
            // },
            // {
            //     label: 'โครงการอบรม / สัมนา',
            //     icon: faLayerGroup,
            //     routerLink: '/training',
            // },
            // {
            //     label: 'ประเภทสินค้า',
            //     icon: faBagShopping,
            //     routerLink: '/products',
            // },
        ];
    }
}
