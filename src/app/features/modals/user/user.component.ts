import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserModalComponent implements OnInit {
    title = 'User Modal';
    userData: FormGroup = new FormGroup({});

    faXmark = faXmark;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<UserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; userData?: User },
    ) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm(): void {
        if (this.data.mode === 'add') {
            this.userData = this.fb.group({
                userId: [''],
                username: [''],
                email: [''],
                group: [''],
                role: [''],
                profile: [''],
            });
        } else {
            this.userData = this.fb.group({
                userId: [this.data.userData?.userId],
                username: [this.data.userData?.username],
                email: [this.data.userData?.email],
                group: [this.data.userData?.group],
                role: [this.data.userData?.role],
                profile: [this.data.userData?.profile],
            });
        }
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
