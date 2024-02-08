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
        const isViewMode = this.data.mode === 'view';

        if (this.data.mode === 'add') {
            this.userData = this.fb.group({
                userId: [],
                username: [''],
                email: [''],
                group: [''],
                role: [''],
                profile: [''],
            });
        } else {
            this.userData = this.fb.group({
                userId: [{ value: this.data.userData?.userId, disabled: isViewMode }],
                username: [{ value: this.data.userData?.username, disabled: isViewMode }],
                email: [{ value: this.data.userData?.email, disabled: isViewMode }],
                group: [{ value: this.data.userData?.group, disabled: isViewMode }],
                role: [{ value: this.data.userData?.role, disabled: isViewMode }],
                profile: [{ value: this.data.userData?.profile, disabled: isViewMode }],
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
