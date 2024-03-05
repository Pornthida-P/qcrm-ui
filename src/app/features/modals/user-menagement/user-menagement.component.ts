import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-user-menagement',
    templateUrl: './user-menagement.component.html',
    styleUrl: './user-menagement.component.scss',
})
export class UserMenagementComponent {
    title = 'menagement-user';

    faXmark = faXmark;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    constructor(
        public dialogRef: MatDialogRef<UserMenagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; member?: User },
    ) {}

    ngOnInit(): void {}

    onClickClose(): void {
        this.dialogRef.close();
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
