import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { Group } from 'src/app/shared/interface/group.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-menagement-team',
    templateUrl: './menagement-team.component.html',
    styleUrl: './menagement-team.component.scss',
})
export class MenagementTeamComponent implements OnInit {
    groupForm: FormGroup = new FormGroup({});
    title: string = 'Group Management';
    userData?: User | null;
    selectedMembers: User[] = [];
    members: User[] = [];
    isAction: boolean = false;

    faXmark = faXmark;

    constructor(
        private fb: FormBuilder,
        private sweetalertService: SweetAlertService,
        private userService: UserService,
        private cdRef: ChangeDetectorRef,
        private dialogRef: MatDialogRef<MenagementTeamComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; group?: Group },
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.getUserData();
        this.getMembers();
    }

    initializeForm(): void {
        const isViewMode = this.data.mode === 'view';

        if (this.data.mode === 'add') {
            this.groupForm = this.fb.group({
                groupId: [''],
                groupTitle: ['', Validators.required],
                description: [''],
                members: ['', Validators.required],
                createdAt: [''],
                createdById: [''],
                modifiedAt: [''],
                modifiedById: [''],
            });
        } else {
            this.groupForm = this.fb.group({
                groupId: [{ value: this.data.group?.groupId, disabled: isViewMode }],
                groupTitle: [{ value: this.data.group?.groupTitle, disabled: isViewMode }, Validators.required],
                description: [{ value: this.data.group?.description, disabled: isViewMode }],
                members: [{ value: this.data.group?.members, disabled: isViewMode }, Validators.required],
                createdAt: [{ value: this.data.group?.createdAt, disabled: isViewMode }],
                createdById: [{ value: this.data.group?.createdById, disabled: isViewMode }],
                modifiedAt: [{ value: this.data.group?.modifiedAt, disabled: isViewMode }],
                modifiedById: [{ value: this.data.group?.modifiedById, disabled: isViewMode }],
            });
        }
    }

    getUserData() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAction = res?.role.roleTitle.toLowerCase() === 'admin' ? true : false;
        });
    }

    async getMembers() {
        this.userService
            .getAllUser()
            .pipe(
                tap((members) => {
                    this.members = members;

                    this.selectedMembers = members.filter((member) => {
                        return this.data.group?.members.some((eventMember) => eventMember.userId === member.userId);
                    });
                    this.groupForm.get('members')!.setValue(this.selectedMembers);
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    onMemberSelectionChange(event: any): void {
        this.selectedMembers = event.value;
        this.cdRef.detectChanges();
    }

    onDeletedMember(userId: string) {
        this.selectedMembers = this.selectedMembers.filter((member) => member.userId !== userId);
        this.groupForm.get('members')!.setValue(this.selectedMembers);
    }

    onSubmit() {
        if (this.groupForm.invalid) {
            this.sweetalertService.getSwal('warning', 'Warning', 'Please fill in the required fields.', false, '');
            return;
        }

        const form = this.groupForm.value;

        if (this.data.mode === 'add') {
            form.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
            form.createdById = this.userData?.userId;

            this.userService
                .addGroup(form)
                .pipe(
                    tap(() => {
                        this.dialogRef.close();
                        this.sweetalertService.getSwal('success', 'Success', 'Group added successfully.', false, '');
                    }),
                    catchError((error) => {
                        this.sweetalertService.handleError(error);
                        throw error;
                    }),
                )
                .subscribe();
        } else if (this.data.mode === 'edit') {
            form.modifiedAt = moment().format('YYYY-MM-DD HH:mm:ss');
            form.modifiedById = this.userData?.userId;

            this.userService
                .updateGroup(form)
                .pipe(
                    tap(() => {
                        this.dialogRef.close();
                        this.sweetalertService.getSwal('success', 'Success', 'Group updated successfully.', false, '');
                    }),
                    catchError((error) => {
                        this.sweetalertService.handleError(error);
                        throw error;
                    }),
                )
                .subscribe();
        }
    }

    close() {
        this.dialogRef.close();
    }
}
