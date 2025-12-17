import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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

    title: string = '';

    constructor(private router: Router, private translate: TranslateService) {}

    ngOnInit(): void {
        this.title = this.translate.instant('menu.settingTitle');
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
