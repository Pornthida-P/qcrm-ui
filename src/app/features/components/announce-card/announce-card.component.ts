import { Component, Input } from '@angular/core';
import { faCalendarAlt, faEdit, faList, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-announce-card',
    templateUrl: './announce-card.component.html',
    styleUrl: './announce-card.component.scss',
})
export class AnnounceCardComponent {
    @Input() card: any;
    faEdit = faEdit;
    faTrash = faTrash;
    faCalendar = faCalendarAlt;
    faList = faList;
    faUserGroup = faUserGroup;
}
