import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-service-type-management',
    standalone: false,
    templateUrl: './service-type-management.component.html',
    styleUrl: './service-type-management.component.scss',
})
export class ServiceTypeManagementComponent implements OnInit {
    title = 'service-type';

    faXmark = faXmark;

    serviceTypeForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    constructor(
        public dialogRef: MatDialogRef<ServiceTypeManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; serviceType?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        switch (this.data.mode) {
            case 'add':
                this.serviceTypeForm.patchValue({
                    name: '',
                });
                break;

            case 'view':
                this.populateForm(this.data.serviceType);
                this.serviceTypeForm.disable();
                break;

            case 'edit':
                this.populateForm(this.data.serviceType);
                break;

            default:
                break;
        }
    }

    private populateForm(serviceType: any): void {
        if (!serviceType) return;

        this.serviceTypeForm.patchValue({
            name: serviceType.name || '',
        });
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    saveServiceType(): void {
        if (this.serviceTypeForm.valid) {
            const formValue = this.serviceTypeForm.value;
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            if (this.data.mode === 'add') {
                const createData = {
                    name: formValue.name,
                    createdById: userData.userId,
                };
                this.callService.createCaseServiceType(createData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.createServiceTypeSuccess');
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
                this.callService.updateCaseServiceType(this.data.serviceType.id, updateData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.updateServiceTypeSuccess');
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

