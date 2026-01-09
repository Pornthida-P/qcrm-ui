import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs/operators';
import { ServiceSubTypeManagementComponent } from 'src/app/features/modals/service-sub-type-management/service-sub-type-management.component';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-service-sub-type-tab',
    standalone: false,
    templateUrl: './service-sub-type-tab.component.html',
    styleUrl: './service-sub-type-tab.component.scss',
})
export class ServiceSubTypeTabComponent implements OnInit {
    title: string = 'service-sub-type';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['name'];
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    serviceSubTypes: any[] = [];

    constructor(
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private dialog: MatDialog,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.findAllServiceSubType();
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
                this.translateService.instant('alert.confirmDeleteServiceSubType'),
                this.translateService.instant('alert.yes'),
                this.translateService.instant('alert.no'),
            )
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    this.callService
                        .deleteServiceSubType(data.id, userData.userId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.success('alert.deleteServiceSubTypeSuccess');
                                this.findAllServiceSubType();
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

    findAllServiceSubType() {
        this.callService
            .getServiceSubType()
            .pipe(
                tap((response: any) => {
                    const serviceSubTypes = Array.isArray(response) ? response : [];
                    this.serviceSubTypes = serviceSubTypes;
                    this.dataSource = new MatTableDataSource<any>(this.serviceSubTypes);
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    openDialog(mode: 'add' | 'view' | 'edit', serviceSubType?: any): void {
        const dialogRef = this.dialog.open(ServiceSubTypeManagementComponent, {
            width: '50%',
            maxWidth: '600px',
            data: { mode, serviceSubType },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllServiceSubType();
            }
        });
    }
}
