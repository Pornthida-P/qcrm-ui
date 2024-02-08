import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenagementAnnounceListComponent } from 'src/app/features/modals/menagement-announce-list/menagement-announce-list/menagement-announce-list.component';
import { MenagementAnnounceComponent } from 'src/app/features/modals/menagement-announce/menagement-announce.component';
import { Announce } from 'src/app/shared/interface/announce.interface';

@Injectable({
    providedIn: 'root',
})
export class ModalAnnouncementService {
    constructor(public dialog: MatDialog) {}

    openDialogList(mode: 'add' | 'view' | 'edit', announcement?: Announce[]): void {
        const dialogRef = this.dialog.open(MenagementAnnounceListComponent, {
            width: '60%',
            data: { mode, announcement },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }

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
