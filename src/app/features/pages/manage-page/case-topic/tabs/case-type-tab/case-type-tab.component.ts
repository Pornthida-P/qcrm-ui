import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs/operators';
import { CaseTypeManagementComponent } from 'src/app/features/modals/case-type-management/case-type-management.component';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-case-type-tab',
    standalone: false,
    templateUrl: './case-type-tab.component.html',
    styleUrl: './case-type-tab.component.scss',
})
export class CaseTypeTabComponent implements OnInit {
    title: string = 'case-type';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['name'];
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    caseTypes: any[] = [];

    constructor(
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private dialog: MatDialog,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.findAllCaseType();
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
                this.translateService.instant('alert.confirmDeleteCaseType'),
                this.translateService.instant('alert.yes'),
                this.translateService.instant('alert.no'),
            )
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    this.callService
                        .deleteCaseType(data.id, userData.userId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.success('alert.deleteCaseTypeSuccess');
                                this.findAllCaseType();
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

    findAllCaseType() {
        this.callService
            .getCaseType()
            .pipe(
                tap((response: any) => {
                    const caseTypes = Array.isArray(response) ? response : [];
                    this.caseTypes = caseTypes;
                    this.dataSource = new MatTableDataSource<any>(this.caseTypes);
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    openDialog(mode: 'add' | 'view' | 'edit', caseType?: any): void {
        const dialogRef = this.dialog.open(CaseTypeManagementComponent, {
            width: '50%',
            maxWidth: '600px',
            data: { mode, caseType },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllCaseType();
            }
        });
    }
}
