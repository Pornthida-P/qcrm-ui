import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUsers, faFileImport, faFileLines } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-manage-page',
    standalone: false,
    templateUrl: './manage-page.component.html',
    styleUrl: './manage-page.component.scss',
})
export class ManagePageComponent implements OnInit {
    menuList = [
        { label: 'menu.manage.lead-management', route: 'lead-management' },
        { label: 'menu.manage.case-topic', route: 'case-topic' },
        { label: 'menu.manage.user', route: 'menagement-member' },
    ];

    constructor(private router: Router) {}

    ngOnInit(): void {}

    go(route: string) {
        this.router.navigate(['/manage-page', route]);
    }

    isActive(route: string): boolean {
        return this.router.url.includes(route);
    }
}
