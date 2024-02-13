import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-menagement-password',
    templateUrl: './menagement-password.component.html',
    styleUrl: './menagement-password.component.scss',
})
export class MenagementPasswordComponent implements OnInit {
    userData?: User | null;
    currentPassword: string = '';
    newPassword: string = '';
    verifyPassword: string = '';
    isAction: boolean = false;

    passwordForm: FormGroup = new FormGroup({});

    constructor(private userService: UserService, private fb: FormBuilder, private sweetalertService: SweetAlertService) {}

    ngOnInit(): void {
        this.initializeForm();
        this.getUserData();
    }

    initializeForm(): void {
        this.passwordForm = this.fb.group({
            currentPassword: ['', [Validators.required, Validators.minLength(8)]],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            verifyPassword: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    getUserData(): void {
        this.userService
            .getDataUser()
            .pipe(
                tap((res: User | null) => {
                    this.userData = res;
                    this.isAction = res?.role.roleTitle.toLocaleLowerCase() === 'admin' ? true : false;
                }),
            )
            .subscribe((res) => {});
    }

    onSubmit() {
        if (this.passwordForm.invalid) {
            this.sweetalertService.getSwal('error', 'Warning', 'Please fill in all the fields.', false, '');
            return;
        }

        const { newPassword, verifyPassword, currentPassword } = this.passwordForm.value;
        if (newPassword !== verifyPassword) {
            this.sweetalertService.getSwal('error', 'Warning', 'Password does not match.', false, '');
            this.passwordForm.reset();
            return;
        }

        this.userService
            .updatePassword(this.userData?.userId || '', newPassword, currentPassword)
            .pipe(
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    return error;
                }),
            )
            .subscribe((res) => {
                this.sweetalertService.getSwal('success', 'Success', 'Password has been updated.', false, '');
                this.passwordForm.reset();
            });
    }
}
