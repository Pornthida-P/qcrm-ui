import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs/operators';
import { CaseCodeManagementComponent } from 'src/app/features/modals/case-code-management/case-code-management.component';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-case-code-tab',
    standalone: false,
    templateUrl: './case-code-tab.component.html',
    styleUrl: './case-code-tab.component.scss',
})
export class CaseCodeTabComponent implements OnInit {
    title: string = 'case-code';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['code'];
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    caseCodes: any[] = [];

    constructor(
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private dialog: MatDialog,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.findAllCaseCode();
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
                this.translateService.instant('alert.confirmDeleteCaseCode'),
                this.translateService.instant('alert.yes'),
                this.translateService.instant('alert.no'),
            )
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    this.callService
                        .deleteCaseCode(data.id, userData.userId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.success('alert.deleteCaseCodeSuccess');
                                this.findAllCaseCode();
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

    findAllCaseCode() {
        this.callService
            .getCaseCode()
            .pipe(
                tap((response: any) => {
                    const caseCodes = Array.isArray(response) ? response : [];
                    this.caseCodes = caseCodes;
                    this.dataSource = new MatTableDataSource<any>(this.caseCodes);
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    openDialog(mode: 'add' | 'view' | 'edit', caseCode?: any): void {
        const dialogRef = this.dialog.open(CaseCodeManagementComponent, {
            width: '60%',
            maxWidth: '90vw',
            data: { mode, caseCode },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllCaseCode();
            }
        });
    }
}

