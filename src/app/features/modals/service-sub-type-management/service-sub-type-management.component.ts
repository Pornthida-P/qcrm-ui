import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-service-sub-type-management',
    standalone: false,
    templateUrl: './service-sub-type-management.component.html',
    styleUrl: './service-sub-type-management.component.scss',
})
export class ServiceSubTypeManagementComponent implements OnInit {
    title = 'service-sub-type';

    faXmark = faXmark;

    serviceSubTypeForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    constructor(
        public dialogRef: MatDialogRef<ServiceSubTypeManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; serviceSubType?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        switch (this.data.mode) {
            case 'add':
                this.serviceSubTypeForm.patchValue({
                    name: '',
                });
                break;

            case 'view':
                this.populateForm(this.data.serviceSubType);
                this.serviceSubTypeForm.disable();
                break;

            case 'edit':
                this.populateForm(this.data.serviceSubType);
                break;

            default:
                break;
        }
    }

    private populateForm(serviceSubType: any): void {
        if (!serviceSubType) return;

        this.serviceSubTypeForm.patchValue({
            name: serviceSubType.name || '',
        });
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    saveServiceSubType(): void {
        if (this.serviceSubTypeForm.valid) {
            const formValue = this.serviceSubTypeForm.value;
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            if (this.data.mode === 'add') {
                const createData = {
                    name: formValue.name,
                    createdById: userData.userId,
                };
                this.callService.createServiceSubType(createData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.createServiceSubTypeSuccess');
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
                this.callService.updateServiceSubType(this.data.serviceSubType.id, updateData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.updateServiceSubTypeSuccess');
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

