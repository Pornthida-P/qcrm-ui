import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-service-group-management',
    standalone: false,
    templateUrl: './service-group-management.component.html',
    styleUrl: './service-group-management.component.scss',
})
export class ServiceGroupManagementComponent implements OnInit {
    title = 'service-group';

    faXmark = faXmark;

    serviceGroupForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    constructor(
        public dialogRef: MatDialogRef<ServiceGroupManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; serviceGroup?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        switch (this.data.mode) {
            case 'add':
                this.serviceGroupForm.patchValue({
                    name: '',
                });
                break;

            case 'view':
                this.populateForm(this.data.serviceGroup);
                this.serviceGroupForm.disable();
                break;

            case 'edit':
                this.populateForm(this.data.serviceGroup);
                break;

            default:
                break;
        }
    }

    private populateForm(serviceGroup: any): void {
        if (!serviceGroup) return;

        this.serviceGroupForm.patchValue({
            name: serviceGroup.name || '',
        });
    }

    private parseResponse(response: any): any {
        if (Array.isArray(response)) {
            return response;
        }
        if (typeof response === 'string') {
            try {
                return JSON.parse(response);
            } catch {
                return response;
            }
        }
        return response ?? {};
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    saveServiceGroup(): void {
        if (this.serviceGroupForm.valid) {
            const formValue = this.serviceGroupForm.value;
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            if (this.data.mode === 'add') {
                const createData = {
                    name: formValue.name,
                    createdById: userData.userId,
                };
                this.callService.createCaseServiceGroup(createData).subscribe({
                    next: (res: any) => {
                        const result = this.parseResponse(res);
                        if (result?.success === false) {
                            this.sweetalertService.showServiceSaveFailure(result);
                            return;
                        }
                        this.sweetalertService.success('alert.createServiceGroupSuccess');
                        this.dialogRef.close(result);
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
                this.callService.updateCaseServiceGroup(this.data.serviceGroup.id, updateData).subscribe({
                    next: (res: any) => {
                        const result = this.parseResponse(res);
                        if (result?.success === false) {
                            this.sweetalertService.showServiceSaveFailure(result);
                            return;
                        }
                        this.sweetalertService.success('alert.updateServiceGroupSuccess');
                        this.dialogRef.close(result);
                    },
                    error: (error) => {
                        this.sweetalertService.handleError(error);
                    },
                });
            }
        }
    }
}

