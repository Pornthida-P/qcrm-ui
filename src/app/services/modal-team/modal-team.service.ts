import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenagementTeamComponent } from 'src/app/features/modals/menagement-team/menagement-team.component';
import { Group } from 'src/app/shared/interface/group.interface';

@Injectable({
    providedIn: 'root',
})
export class ModalTeamService {
    constructor(public dialog: MatDialog) {}

    openDialog(mode: 'add' | 'view' | 'edit', group?: Group): void {
        const dialogRef = this.dialog.open(MenagementTeamComponent, {
            width: '60%',
            data: { mode, group },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }
}
