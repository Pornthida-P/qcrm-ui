import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';

@Component({
    selector: 'app-card-event-list',
    templateUrl: './card-event-list.component.html',
    styleUrl: './card-event-list.component.scss',
})
export class CardEventListComponent implements OnInit {
    @Input() events: CalendarEvent[] = [];
    @Input() title?: string = '';
    @Input() isAction?: boolean = false;

    @Output() onClickAdd: EventEmitter<any> = new EventEmitter();

    faPlus = faPlusCircle;

    constructor() {}

    ngOnInit(): void {}

    onClickAddEvent(): void {
        this.onClickAdd.emit();
    }
}
