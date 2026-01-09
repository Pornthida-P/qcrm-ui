import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-case-type-management',
    standalone: false,
    templateUrl: './case-type-management.component.html',
    styleUrl: './case-type-management.component.scss',
})
export class CaseTypeManagementComponent implements OnInit {
    title = 'case-type';

    faXmark = faXmark;

    caseTypeForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    constructor(
        public dialogRef: MatDialogRef<CaseTypeManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; caseType?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        switch (this.data.mode) {
            case 'add':
                this.caseTypeForm.patchValue({
                    name: '',
                });
                break;

            case 'view':
                this.populateForm(this.data.caseType);
                this.caseTypeForm.disable();
                break;

            case 'edit':
                this.populateForm(this.data.caseType);
                break;

            default:
                break;
        }
    }

    private populateForm(caseType: any): void {
        if (!caseType) return;

        this.caseTypeForm.patchValue({
            name: caseType.name || '',
        });
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    saveCaseType(): void {
        if (this.caseTypeForm.valid) {
            const formValue = this.caseTypeForm.value;
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            if (this.data.mode === 'add') {
                const createData = {
                    name: formValue.name,
                    createdById: userData.userId,
                };
                this.callService.createCaseType(createData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.createCaseTypeSuccess');
                            this.dialogRef.close(res);
                        } else {
                            this.sweetalertService.handleError(res);
                        }
                    },
                    error: (error) => {
                        this.sweetalertService.handleError(error);
                    },
                });
            } else if (this.data.mode === 'edit') {
                const updateData = {
                    name: formValue.name,
                    modifiedById: userData.userId,
                };
                this.callService.updateCaseType(this.data.caseType.id, updateData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.updateCaseTypeSuccess');
                            this.dialogRef.close(res);
                        } else {
                            this.sweetalertService.handleError(res);
                        }
                    },
                    error: (error) => {
                        this.sweetalertService.handleError(error);
                    },
                });
            }
        }
    }
}

