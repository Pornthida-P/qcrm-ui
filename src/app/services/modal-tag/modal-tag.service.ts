import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenagementTagComponent } from 'src/app/features/modals/menagement-tag/menagement-tag.component';
import { CalendarTag } from 'src/app/shared/interface/calendar.interface';

@Injectable({
    providedIn: 'root',
})
export class ModalTagService {
    constructor(public dialog: MatDialog) {}

    openDialog(mode: 'add' | 'view' | 'edit', tag?: CalendarTag): void {
        const dialogRef = this.dialog.open(MenagementTagComponent, {
            width: '60%',
            data: { mode, tag },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }
}
