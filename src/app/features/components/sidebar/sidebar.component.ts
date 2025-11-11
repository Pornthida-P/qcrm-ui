import { Component, OnInit } from '@angular/core';
import { faChartPie, faFileLines, faFilePen, faHouse, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
    items: any = [];
    userData: User | null = null;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.getDataUser();

        this.items = [
            {
                label: 'home',
                icon: faHouse,
                routerLink: '/home',
                roles: [1,2,3]
            },
            {
                label: 'contacts',
                icon: faFileLines,
                routerLink: '/contacts',
                roles: [1,2,3]
            },
            {
                label: 'call',
                icon: faPhoneVolume,
                routerLink: '/call',
                roles: [1,2,3]
            },
            {
                label: 'report-page',
                icon: faChartPie,
                routerLink: '/report-page',
                roles: [1,2]
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

    getDataUser() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
        });
    }

    hasRole(itemRoles: number[]): boolean {
        return itemRoles.includes(Number(this.userData?.role?.roleId));
    }
}
