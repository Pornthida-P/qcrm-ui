import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { catchError, forkJoin, tap } from 'rxjs';
import { ServiceTypeManagementComponent } from 'src/app/features/modals/service-type-management/service-type-management.component';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-service-type-tab',
    standalone: false,
    templateUrl: './service-type-tab.component.html',
    styleUrl: './service-type-tab.component.scss',
})
export class ServiceTypeTabComponent implements OnInit {
    title: string = 'service-type';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['name', 'caseServiceGroupName', 'subTypeCount'];
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    serviceTypes: any[] = [];

    constructor(
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private dialog: MatDialog,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.findAllServiceType();
    }

    onClickView(data: any) {
        this.openDialog('view', data);
    }

    onClickEdit(data: any) {
        this.openDialog('edit', data);
    }

    onClickDelete(data: any) {
        this.sweetalertService
            .confirmSwal(
                'warning',
                this.translateService.instant('alert.warning'),
                this.translateService.instant('alert.confirmDeleteServiceType'),
                this.translateService.instant('alert.yes'),
                this.translateService.instant('alert.no'),
            )
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    this.callService
                        .deleteCaseServiceType(data.id, userData.userId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.success('alert.deleteServiceTypeSuccess');
                                this.findAllServiceType();
                            }),
                            catchError((error) => {
                                this.sweetalertService.handleError(error);
                                throw error;
                            }),
                        )
                        .subscribe();
                }
            });
    }

    onClickAdd() {
        this.openDialog('add');
    }

    onSearch(text: string) {
        this.dataSource.filter = text.trim().toLowerCase();
    }

    findAllServiceType() {
        forkJoin({
            serviceTypes: this.callService.getCaseServiceType(),
            junctionRows: this.callService.getCaseServiceTypeSubType(),
        })
            .pipe(
                tap(({ serviceTypes, junctionRows }: any) => {
                    const parsedServiceTypes = this.parseResponseArray(serviceTypes);
                    const parsedJunctionRows = this.parseResponseArray(junctionRows);
                    const subTypeCountByTypeId = this.buildSubTypeCountMap(parsedJunctionRows);

                    this.serviceTypes = parsedServiceTypes.map((serviceType: any) => ({
                        ...serviceType,
                        subTypeCount: subTypeCountByTypeId.get(Number(serviceType.id)) || 0,
                    }));
                    this.dataSource = new MatTableDataSource<any>(this.serviceTypes);
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    private parseResponseArray(response: any): any[] {
        const parsed = typeof response === 'string' ? JSON.parse(response) : response;
        return Array.isArray(parsed) ? parsed : [];
    }

    private buildSubTypeCountMap(junctionRows: any[]): Map<number, number> {
        const subTypeCountByTypeId = new Map<number, number>();

        junctionRows.forEach((row: any) => {
            const typeId = Number(row.caseServiceTypeId);
            if (!typeId) {
                return;
            }
            subTypeCountByTypeId.set(typeId, (subTypeCountByTypeId.get(typeId) || 0) + 1);
        });

        return subTypeCountByTypeId;
    }

    openDialog(mode: 'add' | 'view' | 'edit', serviceType?: any): void {
        const dialogRef = this.dialog.open(ServiceTypeManagementComponent, {
            width: '50%',
            maxWidth: '600px',
            data: { mode, serviceType },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllServiceType();
            }
        });
    }
}
