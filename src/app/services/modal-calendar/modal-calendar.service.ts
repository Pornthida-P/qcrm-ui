import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenagementCalendarComponent } from 'src/app/features/modals/menagement-calendar/menagement-calendar.component';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';

@Injectable({
    providedIn: 'root',
})
export class ModalCalendarService {
    isClose: boolean = true;
    constructor(public dialog: MatDialog) {}

    openDialog(mode: 'add' | 'view' | 'edit', eventData?: CalendarEvent): void {
        if (this.isClose) {
            this.isClose = false;
            const dialogRef = this.dialog.open(MenagementCalendarComponent, {
                width: '60%',
                data: { mode, eventData },
            });

            dialogRef.afterClosed().subscribe((result) => {
                this.isClose = true;
                console.log('The dialog was closed');
            });
        }
    }
}
