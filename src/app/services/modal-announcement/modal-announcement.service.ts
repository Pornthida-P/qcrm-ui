import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenagementAnnounceComponent } from 'src/app/features/modals/menagement-announce/menagement-announce.component';
import { Announce } from 'src/app/shared/interface/announce.interface';

@Injectable({
    providedIn: 'root',
})
export class ModalAnnouncementService {
    constructor(public dialog: MatDialog) {}

    openDialog(mode: 'add' | 'view' | 'edit', announcement?: Announce): void {
        const dialogRef = this.dialog.open(MenagementAnnounceComponent, {
            width: '60%',
            data: { mode, announcement },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }
}
