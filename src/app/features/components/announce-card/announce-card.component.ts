import { Component, Input, OnInit } from '@angular/core';
import { faCalendarAlt, faEdit, faList, faPaperclip, faThumbtack, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { AnnounceCard } from 'src/app/shared/interface/announce.interface';

@Component({
    selector: 'app-announce-card',
    templateUrl: './announce-card.component.html',
    styleUrl: './announce-card.component.scss',
})
export class AnnounceCardComponent implements OnInit {
    @Input() card?: AnnounceCard;

    faEdit = faEdit;
    faTrash = faTrash;
    faThumbtack = faThumbtack;
    faList = faList;
    faPapercilp = faPaperclip;

    ngOnInit(): void {}

    onclickAttachment(url: string) {
        window.open(url, '_blank');
    }
}
