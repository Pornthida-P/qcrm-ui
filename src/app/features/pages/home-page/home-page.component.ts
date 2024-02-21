import { Component } from '@angular/core';
import { faHouse, faInfo, faScroll, faSun, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
    selectedViewType = 'home';
    viewTypes = [
        { value: 'home', icon: faHouse, label: 'Home' },
        { value: 'announcement', icon: faScroll, label: 'Announcement' },
        { value: 'information', icon: faInfo, label: 'Information' },
        { value: 'morningBrief', icon: faSun, label: 'Morning Brief' },
        { value: 'teamActivities', icon: faUsers, label: 'Team Activities' },
    ];

    constructor() {}

    onClickChangeMenu(value: string) {
        this.selectedViewType = value;
    }
}
