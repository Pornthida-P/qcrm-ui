import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faChevronLeft, faChevronRight, faPlusCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';

@Component({
    selector: 'app-pop-overs-event',
    templateUrl: './pop-overs-event.component.html',
    styleUrl: './pop-overs-event.component.scss',
})
export class PopOversEventComponent implements OnInit {
    @Input() events: CalendarEvent[] = [];

    @Output() addEvent: EventEmitter<void> = new EventEmitter();
    @Output() viewEvent: EventEmitter<void> = new EventEmitter();
    @Output() editEvent: EventEmitter<void> = new EventEmitter();
    @Output() deleteEvent: EventEmitter<void> = new EventEmitter();

    faXmark = faXmark;
    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;
    faPlusCircle = faPlusCircle;

    constructor() {}

    ngOnInit(): void {}

    onClickAdd(): void {
        this.addEvent.emit();
    }

    onClickView(): void {
        this.viewEvent.emit();
    }

    onClickEdit(): void {
        this.editEvent.emit();
    }

    onClickDelete(): void {
        this.deleteEvent.emit();
    }
}
