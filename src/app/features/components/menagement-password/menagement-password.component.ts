import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-menagement-password',
    templateUrl: './menagement-password.component.html',
    styleUrl: './menagement-password.component.scss',
})
export class MenagementPasswordComponent implements OnInit {
    currentPassword: string = '';
    newPassword: string = '';
    verifyPassword: string = '';

    ngOnInit(): void {}

    onSubmit() {
        console.log('Reset password form submitted.');
        console.log('Current Password:', this.currentPassword);
        console.log('New Password:', this.newPassword);
        console.log('Verify Password:', this.verifyPassword);
    }
}
