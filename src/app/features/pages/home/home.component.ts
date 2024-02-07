import { Component } from '@angular/core';
import { faCalendar, faList } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    selectedViewType = 'calendar';

    faCalendar = faCalendar;
    faList = faList;

    constructor() {}
}
