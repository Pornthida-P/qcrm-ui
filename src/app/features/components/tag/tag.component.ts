import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarTag } from 'src/app/shared/interface/calendar.interface';

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
    styleUrl: './tag.component.scss',
})
export class TagComponent implements OnInit {
    title = 'แท็ก';

    tags: CalendarTag[] = [];

    constructor(private calendarService: CalendarEventService, private sweetAlertService: SweetAlertService) {}

    ngOnInit(): void {
        this.initzation();
    }

    initzation(): void {
        this.findAllTag();
    }

    findAllTag(): void {
        this.calendarService
            .findAllTags()
            .pipe(
                tap((tags) => {
                    this.tags = tags;
                }),
                catchError((error) => {
                    this.sweetAlertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    onClickAdd() {
        console.log('Add');
    }
}
