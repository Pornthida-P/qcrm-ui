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
    allServiceSubTypes: any[] = [];
    serviceGroups: any[] = [];

    serviceTypeForm: FormGroup = new FormGroup({
        name: new FormControl(''),
        caseServiceGroupId: new FormControl<number | null>(null),
        caseServiceSubTypeIds: new FormControl<number[]>([]),
    });

    constructor(
        public dialogRef: MatDialogRef<ServiceTypeManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; serviceType?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.loadServiceSubTypes();
        this.loadServiceGroups();

        switch (this.data.mode) {
            case 'add':
                this.serviceTypeForm.patchValue({
                    name: '',
                    caseServiceGroupId: null,
                    caseServiceSubTypeIds: [],
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

    private parseResponse(response: any): any {
        if (Array.isArray(response)) {
            return response;
        }
        if (typeof response === 'string') {
            try {
                return JSON.parse(response);
            } catch {
                return [];
            }
        }
        return response ?? [];
    }

    private loadServiceSubTypes(): void {
        this.callService.getServiceSubType().subscribe({
            next: (response: any) => {
                this.allServiceSubTypes = this.parseResponse(response);
            },
            error: (error) => {
                this.sweetalertService.handleError(error);
            },
        });
    }

    private loadServiceGroups(): void {
        this.callService.getCaseServiceGroup().subscribe({
            next: (response: any) => {
                this.serviceGroups = this.parseResponse(response);
            },
            error: (error) => {
                this.sweetalertService.handleError(error);
            },
        });
    }

    private loadMappedSubTypeIds(serviceTypeId: number): void {
        this.callService.getCaseServiceTypeSubType(serviceTypeId).subscribe({
            next: (response: any) => {
                const mappings = this.parseResponse(response);
                const subTypeIds = mappings.map((item: any) => Number(item.caseServiceSubTypeId));
                this.serviceTypeForm.patchValue({ caseServiceSubTypeIds: subTypeIds });
            },
            error: (error) => {
                this.sweetalertService.handleError(error);
            },
        });
    }

    private populateForm(serviceType: any): void {
        if (!serviceType) return;

        this.serviceTypeForm.patchValue({
            name: serviceType.name || '',
            caseServiceGroupId: serviceType.caseServiceGroupId ?? null,
            caseServiceSubTypeIds: [],
        });

        if (serviceType.id) {
            this.loadMappedSubTypeIds(serviceType.id);
        }
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    private syncSubTypeMappings(serviceTypeId: number, userId: string): void {
        const subTypeIds = this.serviceTypeForm.get('caseServiceSubTypeIds')?.value ?? [];
        this.callService
            .syncCaseServiceTypeSubTypes(serviceTypeId, {
                caseServiceSubTypeIds: subTypeIds,
                modifiedById: userId,
            })
            .subscribe({
                error: (error) => {
                    this.sweetalertService.handleError(error);
                },
            });
    }

    saveServiceType(): void {
        if (!this.serviceTypeForm.valid) {
            return;
        }

        const formValue = this.serviceTypeForm.value;
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        if (this.data.mode === 'add') {
            const createData = {
                name: formValue.name,
                caseServiceGroupId: formValue.caseServiceGroupId,
                createdById: userData.userId,
            };
            this.callService.createCaseServiceType(createData).subscribe({
                next: (res: any) => {
                    const result = this.parseResponse(res);
                    if (result?.success === false) {
                        this.sweetalertService.handleError(result);
                        return;
                    }

                    const serviceTypeId = result?.id;
                    if (serviceTypeId) {
                        this.syncSubTypeMappings(serviceTypeId, userData.userId);
                    }

                    this.sweetalertService.success('alert.createServiceTypeSuccess');
                    this.dialogRef.close(result);
                },
                error: (error) => {
                    this.sweetalertService.handleError(error);
                },
            });
        } else if (this.data.mode === 'edit') {
            const updateData = {
                name: formValue.name,
                caseServiceGroupId: formValue.caseServiceGroupId,
                modifiedById: userData.userId,
            };
            this.callService.updateCaseServiceType(this.data.serviceType.id, updateData).subscribe({
                next: (res: any) => {
                    const result = this.parseResponse(res);
                    if (result?.success === false) {
                        this.sweetalertService.handleError(result);
                        return;
                    }

                    this.syncSubTypeMappings(this.data.serviceType.id, userData.userId);
                    this.sweetalertService.success('alert.updateServiceTypeSuccess');
                    this.dialogRef.close(result);
                },
                error: (error) => {
                    this.sweetalertService.handleError(error);
                },
            });
        }
    }
}
