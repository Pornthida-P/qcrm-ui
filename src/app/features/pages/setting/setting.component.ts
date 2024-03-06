import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit, AfterViewInit {
    @ViewChild('menu') menu: ElementRef | undefined;
    @ViewChild('content') content: ElementRef | undefined;

    menuSetting: any[] = [];
    menuLogout: any = {};

    title: string = 'ตั้งค่า';

    constructor(private router: Router) {}

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

    ngAfterViewInit() {
        if (this.menu && this.content) {
            const menuHeight = this.menu.nativeElement.offsetHeight;
            this.content.nativeElement.style.maxHeight = `${menuHeight}px`;
        }
    }
}
