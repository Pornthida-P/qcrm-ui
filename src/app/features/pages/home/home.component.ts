import { Component } from '@angular/core';
import { faHouse, faInfo, faScroll, faSun, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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
