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
    filteredServiceSubTypes: any[] = [];
    selectedServiceSubTypes: any[] = [];
    serviceSubTypeControl = new FormControl('');
    serviceGroupControl = new FormControl('');
    serviceGroups: any[] = [];
    filteredServiceGroups: any[] = [];
    selectedServiceGroups: any[] = [];

    serviceTypeForm: FormGroup = new FormGroup({
        name: new FormControl(''),
        caseServiceGroupIds: new FormControl<number[]>([]),
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
                this.selectedServiceSubTypes = [];
                this.selectedServiceGroups = [];
                this.serviceSubTypeControl.setValue('');
                this.serviceGroupControl.setValue('');
                this.serviceTypeForm.patchValue({
                    name: '',
                    caseServiceGroupIds: [],
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

    private parseGroupIds(serviceType?: any): number[] {
        if (!serviceType || !Array.isArray(serviceType.caseServiceGroupIds)) {
            return [];
        }

        return serviceType.caseServiceGroupIds.map((id: any) => Number(id)).filter((id: number) => Number.isFinite(id));
    }

    private syncSelectedServiceGroups(ids: number[]): void {
        this.selectedServiceGroups = ids
            .map((id) => this.serviceGroups.find((group) => group.id == id))
            .filter((group): group is any => !!group);
    }

    filterServiceGroups(): void {
        const controlValue = this.serviceGroupControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        const selectedIds = new Set(this.serviceTypeForm.get('caseServiceGroupIds')?.value ?? []);
        const availableGroups = this.serviceGroups.filter((group: any) => !selectedIds.has(group.id));

        if (!filterValue) {
            this.filteredServiceGroups = [...availableGroups];
            return;
        }

        this.filteredServiceGroups = availableGroups.filter((group: any) =>
            group.name?.toLowerCase().includes(filterValue),
        );
    }

    displayServiceGroupFn = (serviceGroup: any): string => {
        return serviceGroup?.name || '';
    };

    onServiceGroupSelected(event: any): void {
        const selected = event.option.value;
        if (!selected?.id) {
            return;
        }

        const currentIds: number[] = this.serviceTypeForm.get('caseServiceGroupIds')?.value ?? [];
        if (currentIds.includes(selected.id)) {
            this.serviceGroupControl.setValue('');
            return;
        }

        this.selectedServiceGroups = [...this.selectedServiceGroups, selected];
        this.serviceTypeForm.patchValue({ caseServiceGroupIds: [...currentIds, selected.id] });
        this.serviceGroupControl.setValue('');
        this.filterServiceGroups();
    }

    removeServiceGroup(group: any): void {
        const currentIds: number[] = this.serviceTypeForm.get('caseServiceGroupIds')?.value ?? [];
        const nextIds = currentIds.filter((id) => id !== group.id);
        this.serviceTypeForm.patchValue({ caseServiceGroupIds: nextIds });
        this.syncSelectedServiceGroups(nextIds);
        this.filterServiceGroups();
    }

    filterServiceSubTypes(): void {
        const controlValue = this.serviceSubTypeControl.value as any;
        const originalValue = (typeof controlValue === 'object' && controlValue ? controlValue.name : controlValue || '')
            .toString()
            .trim();
        const filterValue = originalValue.toLowerCase();
        const selectedIds = new Set(this.serviceTypeForm.get('caseServiceSubTypeIds')?.value ?? []);
        const availableSubTypes = this.allServiceSubTypes.filter((subType: any) => !selectedIds.has(subType.id));

        if (!filterValue) {
            this.filteredServiceSubTypes = [...availableSubTypes];
            return;
        }

        this.filteredServiceSubTypes = availableSubTypes.filter((subType: any) =>
            subType.name?.toLowerCase().includes(filterValue),
        );
    }

    displayServiceSubTypeFn = (serviceSubType: any): string => {
        return serviceSubType?.name || '';
    };

    onServiceSubTypeSelected(event: any): void {
        const selected = event.option.value;
        if (!selected?.id) {
            return;
        }

        const currentIds: number[] = this.serviceTypeForm.get('caseServiceSubTypeIds')?.value ?? [];
        if (currentIds.includes(selected.id)) {
            this.serviceSubTypeControl.setValue('');
            return;
        }

        this.selectedServiceSubTypes = [...this.selectedServiceSubTypes, selected];
        this.serviceTypeForm.patchValue({ caseServiceSubTypeIds: [...currentIds, selected.id] });
        this.serviceSubTypeControl.setValue('');
        this.filterServiceSubTypes();
    }

    removeServiceSubType(subType: any): void {
        const currentIds: number[] = this.serviceTypeForm.get('caseServiceSubTypeIds')?.value ?? [];
        this.selectedServiceSubTypes = this.selectedServiceSubTypes.filter((item) => item.id !== subType.id);
        this.serviceTypeForm.patchValue({ caseServiceSubTypeIds: currentIds.filter((id) => id !== subType.id) });
        this.filterServiceSubTypes();
    }

    private syncSelectedServiceSubTypes(ids: number[]): void {
        this.selectedServiceSubTypes = ids
            .map((id) => this.allServiceSubTypes.find((subType) => subType.id == id))
            .filter((subType): subType is any => !!subType);
    }

    private loadServiceSubTypes(): void {
        this.callService.getServiceSubType().subscribe({
            next: (response: any) => {
                this.allServiceSubTypes = this.parseResponse(response);
                const ids: number[] = this.serviceTypeForm.get('caseServiceSubTypeIds')?.value ?? [];
                if (ids.length > 0) {
                    this.syncSelectedServiceSubTypes(ids);
                }
                this.filterServiceSubTypes();
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
                const groupIds: number[] = this.serviceTypeForm.get('caseServiceGroupIds')?.value ?? [];
                if (groupIds.length > 0) {
                    this.syncSelectedServiceGroups(groupIds);
                }
                this.filterServiceGroups();
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
                this.syncSelectedServiceSubTypes(subTypeIds);
            },
            error: (error) => {
                this.sweetalertService.handleError(error);
            },
        });
    }

    private loadMappedGroupIds(serviceTypeId: number): void {
        this.callService.getCaseServiceGroupType(undefined, serviceTypeId).subscribe({
            next: (response: any) => {
                const mappings = this.parseResponse(response);
                const groupIds = mappings.map((item: any) => Number(item.caseServiceGroupId));
                this.serviceTypeForm.patchValue({ caseServiceGroupIds: groupIds });
                this.syncSelectedServiceGroups(groupIds);
            },
            error: (error) => {
                this.sweetalertService.handleError(error);
            },
        });
    }

    private populateForm(serviceType: any): void {
        if (!serviceType) return;

        const groupIds = this.parseGroupIds(serviceType);
        this.serviceTypeForm.patchValue({
            name: serviceType.name || '',
            caseServiceGroupIds: groupIds,
            caseServiceSubTypeIds: [],
        });
        this.syncSelectedServiceGroups(groupIds);

        if (serviceType.id) {
            this.loadMappedGroupIds(serviceType.id);
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
                caseServiceGroupIds: formValue.caseServiceGroupIds ?? [],
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
                caseServiceGroupIds: formValue.caseServiceGroupIds ?? [],
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
