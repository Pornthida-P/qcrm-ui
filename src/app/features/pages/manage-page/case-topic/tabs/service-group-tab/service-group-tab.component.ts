import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs/operators';
import { ServiceGroupManagementComponent } from 'src/app/features/modals/service-group-management/service-group-management.component';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-service-group-tab',
    standalone: false,
    templateUrl: './service-group-tab.component.html',
    styleUrl: './service-group-tab.component.scss',
})
export class ServiceGroupTabComponent implements OnInit {
    title: string = 'service-group';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['name'];
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    serviceGroups: any[] = [];

    constructor(
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private dialog: MatDialog,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.findAllServiceGroup();
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
                this.translateService.instant('alert.confirmDeleteServiceGroup'),
                this.translateService.instant('alert.yes'),
                this.translateService.instant('alert.no'),
            )
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    this.callService
                        .deleteCaseServiceGroup(data.id, userData.userId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.success('alert.deleteServiceGroupSuccess');
                                this.findAllServiceGroup();
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

    findAllServiceGroup() {
        this.callService
            .getCaseServiceGroup()
            .pipe(
                tap((response: any) => {
                    const serviceGroups = Array.isArray(response) ? response : [];
                    this.serviceGroups = serviceGroups;
                    this.dataSource = new MatTableDataSource<any>(this.serviceGroups);
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    openDialog(mode: 'add' | 'view' | 'edit', serviceGroup?: any): void {
        const dialogRef = this.dialog.open(ServiceGroupManagementComponent, {
            width: '50%',
            maxWidth: '600px',
            data: { mode, serviceGroup },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllServiceGroup();
            }
        });
    }
}
