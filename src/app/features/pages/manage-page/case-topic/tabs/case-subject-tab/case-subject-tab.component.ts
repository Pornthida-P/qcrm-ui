import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs/operators';
import { CaseSubjectManagementComponent } from 'src/app/features/modals/case-subject-management/case-subject-management.component';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-case-subject-tab',
    standalone: false,
    templateUrl: './case-subject-tab.component.html',
    styleUrl: './case-subject-tab.component.scss',
})
export class CaseSubjectTabComponent implements OnInit {
    title: string = 'case-subject';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['name'];
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    caseSubjects: any[] = [];

    constructor(
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private dialog: MatDialog,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.findAllCaseSubjects();
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
                this.translateService.instant('alert.confirmDelete'),
                this.translateService.instant('alert.yes'),
                this.translateService.instant('alert.no'),
            )
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    this.callService
                        .deleteCaseSubject(String(data.caseSubjectId), userData.userId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.success('alert.deleteSuccess');
                                this.findAllCaseSubjects();
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

    findAllCaseSubjects() {
        this.callService
            .getCaseSubjects()
            .pipe(
                tap((response: any) => {
                    const caseSubjects = Array.isArray(response) ? response : [];
                    this.caseSubjects = caseSubjects;
                    this.dataSource = new MatTableDataSource<any>(this.caseSubjects);
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    openDialog(mode: 'add' | 'view' | 'edit', caseSubject?: any): void {
        const dialogRef = this.dialog.open(CaseSubjectManagementComponent, {
            width: '50%',
            maxWidth: '600px',
            data: { mode, caseSubject },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllCaseSubjects();
            }
        });
    }
}
