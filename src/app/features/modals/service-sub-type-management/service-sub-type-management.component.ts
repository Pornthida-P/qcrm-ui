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
    linkedServiceTypes: string[] = [];
    isLoadingLinkedTypes = false;

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
                this.loadLinkedServiceTypes(this.data.serviceSubType?.id);
                break;

            case 'edit':
                this.populateForm(this.data.serviceSubType);
                this.loadLinkedServiceTypes(this.data.serviceSubType?.id);
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

    loadLinkedServiceTypes(serviceSubTypeId?: number | string): void {
        if (!serviceSubTypeId) {
            this.linkedServiceTypes = [];
            return;
        }

        this.isLoadingLinkedTypes = true;
        this.callService.getCaseServiceTypeSubType(undefined, serviceSubTypeId).subscribe({
            next: (response: any) => {
                const rows = typeof response === 'string' ? JSON.parse(response) : response;
                const junctionRows = Array.isArray(rows) ? rows : [];
                const typeNames = junctionRows
                    .map((row: any) => row.caseServiceTypeName)
                    .filter((name: string) => !!name);
                this.linkedServiceTypes = [...new Set(typeNames)];
                this.isLoadingLinkedTypes = false;
            },
            error: () => {
                this.linkedServiceTypes = [];
                this.isLoadingLinkedTypes = false;
            },
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
                        const result = this.parseResponse(res);
                        if (result?.success === false) {
                            this.sweetalertService.showServiceSaveFailure(result);
                            return;
                        }
                        this.sweetalertService.success('alert.createServiceSubTypeSuccess');
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
                this.callService.updateServiceSubType(this.data.serviceSubType.id, updateData).subscribe({
                    next: (res: any) => {
                        const result = this.parseResponse(res);
                        if (result?.success === false) {
                            this.sweetalertService.showServiceSaveFailure(result);
                            return;
                        }
                        this.sweetalertService.success('alert.updateServiceSubTypeSuccess');
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

