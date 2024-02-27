import { Component, OnInit } from '@angular/core';
import { faChartPie, faFileLines, faFilePen, faHouse, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';

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
                icon: faHouse,
                routerLink: '/home',
            },
            {
                label: 'ฐานข้อมูลผู้ใช้บริการและประวัติผู้ติดต่อ',
                icon: faFileLines,
                routerLink: '/contacts',
            },
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
            {
                label: 'รายงาน',
                icon: faChartPie,
                routerLink: '/report-page',
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
