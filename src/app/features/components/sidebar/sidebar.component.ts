import { Component, OnInit } from '@angular/core';
import { faChartPie, faClipboardList, faComments, faFileLines, faGear, faHouse, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import { environment } from 'src/environments/environment';

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
                roles: [1, 2, 3],
            },
            {
                label: 'call-list',
                icon: faClipboardList,
                routerLink: '/call-list',
                roles: [1, 2, 3],
            },
            {
                label: 'contacts',
                icon: faFileLines,
                routerLink: '/contacts',
                roles: [1, 2, 3],
            },
            {
                label: 'call',
                icon: faPhoneVolume,
                routerLink: '/call',
                roles: [1, 2, 3],
            },
            ...(environment.features?.chatEnabled
                ? [
                      {
                          label: 'chat',
                          icon: faComments,
                          routerLink: '/chat',
                          roles: [1, 2, 3],
                      },
                  ]
                : []),
            {
                label: 'report-page',
                icon: faChartPie,
                routerLink: '/report-page',
                roles: [1, 2],
            },
            {
                label: 'manage-page',
                icon: faGear,
                routerLink: '/manage-page',
                roles: [2],
            },
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
