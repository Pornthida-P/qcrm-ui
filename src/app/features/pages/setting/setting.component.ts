import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit {
    menuSetting: any[] = [];
    menuLogout: any = {};

    title: string = 'ตั้งค่า';

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
                label: 'สมาชิก',
                icon: '',
                routerLink: 'menagement-member',
            },
            {
                label: 'ทีม',
                icon: '',
                routerLink: 'menagement-team',
            },
            {
                label: 'แท็ก',
                icon: '',
                routerLink: 'tag',
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
