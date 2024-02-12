import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserMenagementComponent } from 'src/app/features/modals/user-menagement/user-menagement.component';
import { User } from 'src/app/shared/interface/user.interface';

@Injectable({
    providedIn: 'root',
})
export class ModalUserService {
    constructor(public dialog: MatDialog) {}

    openDialog(mode: 'add' | 'view' | 'edit', userData?: User): void {
        const dialogRef = this.dialog.open(UserMenagementComponent, {
            width: '60%',
            data: { mode, userData },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }
}
