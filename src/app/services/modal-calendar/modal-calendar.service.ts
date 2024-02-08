import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenagementCalendarComponent } from 'src/app/features/modals/menagement-calendar/menagement-calendar.component';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';

@Injectable({
    providedIn: 'root',
})
export class ModalCalendarService {
    constructor(public dialog: MatDialog) {}

    openDialog(mode: 'add' | 'view' | 'edit', eventData?: CalendarEvent): void {
        const dialogRef = this.dialog.open(MenagementCalendarComponent, {
            width: '60%',
            data: { mode, eventData },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }
}
