import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs/operators';
import { CaseTopicManagementComponent } from 'src/app/features/modals/case-topic-management/case-topic-management.component';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-case-topic-tab',
    standalone: false,
    templateUrl: './case-topic-tab.component.html',
    styleUrl: './case-topic-tab.component.scss',
})
export class CaseTopicTabComponent implements OnInit {
    title: string = 'case-topic';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['name'];
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    caseTopics: any[] = [];

    constructor(
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private dialog: MatDialog,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.findAllCaseTopics();
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
                        .deleteCaseTopic(String(data.caseTopicId), userData.userId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.success('alert.deleteSuccess');
                                this.findAllCaseTopics();
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

    findAllCaseTopics() {
        this.callService
            .getCaseTopics()
            .pipe(
                tap((response: any) => {
                    const caseTopics = Array.isArray(response) ? response : [];
                    this.caseTopics = caseTopics;
                    this.dataSource = new MatTableDataSource<any>(this.caseTopics);
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    openDialog(mode: 'add' | 'view' | 'edit', caseTopic?: any): void {
        const dialogRef = this.dialog.open(CaseTopicManagementComponent, {
            width: '50%',
            maxWidth: '600px',
            data: { mode, caseTopic },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllCaseTopics();
            }
        });
    }
}
