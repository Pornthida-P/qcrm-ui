import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit {
    menuSetting: any[] = [];
    menuLogout: any = {};

    title: string = 'ตั้งค่า';

    constructor(private router: Router, private translateService: TranslateService) {
        translateService.setDefaultLang('th');
    }

    ngOnInit(): void {
        this.menuSetting = [
            {
                label: 'menagement-account',
                icon: '',
                routerLink: 'menagement-account',
            },
            {
                label: 'menagement-password',
                icon: '',
                routerLink: 'menagement-password',
            },
            {
                label: 'menagement-member',
                icon: '',
                routerLink: 'menagement-member',
            },
            {
                label: 'tag',
                icon: '',
                routerLink: 'tag',
            },
            {
                label: 'menagement-team',
                icon: '',
                routerLink: 'menagement-team',
            },
            {
                label: 'menagement-appearance',
                icon: '',
                routerLink: 'menagement-appearance',
            },
            {
                label: 'logout',
                icon: '',
                routerLink: '/logout',
            },
        ];
    }
}
