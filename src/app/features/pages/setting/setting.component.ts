import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faMagnifyingGlass, faBell, faGear, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit {
    menuSetting: any[] = [];
    menuLogout: any = {};

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.menuSetting = [
            {
                label: 'ตั้งค่าบัญชี',
                icon: '',
                routerLink: 'menagement-account',
            },
            {
                label: 'พาสเวิร์ด',
                icon: '',
                routerLink: 'menagement-password',
            },
            {
                label: 'ทีม',
                icon: '',
                routerLink: 'menagement-team',
            },
            {
                label: 'รูปร่าง',
                icon: '',
                routerLink: 'menagement-appearance',
            },
        ];

        this.menuLogout = {
            label: 'ออกจากระบบ',
            icon: '',
            routerLink: '',
        };
    }

    logout() {
        this.router.navigate(['login']);
    }
}
