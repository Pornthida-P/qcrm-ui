import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CaseTopicManagementComponent } from 'src/app/features/modals/case-topic-management/case-topic-management.component';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-case-topic',
    standalone: false,
    templateUrl: './case-topic.component.html',
    styleUrl: './case-topic.component.scss',
})
export class CaseTopicComponent {
    title: string = 'case-topic';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = [];
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    columnVisibility: { [key: string]: boolean } = {};
    ignoreColumns: string[] = ['caseTopicId', 'modityAt', 'modifiedById', 'modifiedAt', 'createdById', 'isDeleted', 'source', 'subjects'];
    showColumnMenu = false;
    caseTopics: any[] = [];
    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }
    constructor(
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private dialog: MatDialog,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.findAllCaseTopic();
    }

    onClickView(data: any) {
        this.openDialog('view', data);
    }

    onClickEdit(data: any) {
        this.openDialog('edit', data);
    }

    onClickDelete(data: any) {
        this.sweetalertService
            .confirmSwal('warning', 'Warning', 'Are you sure you want to delete this case topic?', 'Yes', 'No')
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    this.callService
                        .deleteCaseTopic(data.caseTopicId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.getSwal('success', 'Success', 'Delete case topic successfully.', false, '');
                                this.findAllCaseTopic();
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

    applyColumnVisibility(): void {
        const displayedColumnsTemp: string[] = [];

        Object.keys(this.columnVisibility).forEach((column) => {
            if (this.columnVisibility[column]) {
                displayedColumnsTemp.push(column);
            }
        });

        this.displayedColumns = displayedColumnsTemp;
        this.dataSource = new MatTableDataSource<any>(this.caseTopics);

        this.showColumnMenu = false;
    }

    findAllCaseTopic() {
        forkJoin({
            caseTopics: this.callService.getCaseTopic(),
            subjects: this.callService.getAllCaseSubjects(),
        })
            .pipe(
                tap(({ caseTopics, subjects }) => {
                    const caseTopicsArray = Array.isArray(caseTopics) ? caseTopics : [];
                    const subjectsArray = Array.isArray(subjects) ? subjects : [];

                    this.caseTopics = caseTopicsArray.map((caseTopic: any) => {
                        const caseTopicSubjects = subjectsArray
                            .filter((s: any) => s.caseTopicId == caseTopic.caseTopicId)
                            .map((s: any) => ({
                                caseSubjectId: s.caseSubjectId,
                                code: s.code,
                                name: s.name,
                            }));

                        return {
                            ...caseTopic,
                            subjects: caseTopicSubjects,
                        };
                    });

                    // ----------- table section ------------
                    if (this.caseTopics.length > 0) {
                        // Reset column visibility
                        this.columnVisibility = {};

                        this.caseTopics.forEach((caseTopic) =>
                            Object.keys(caseTopic).forEach((key) => {
                                if (!this.ignoreColumns.includes(key)) {
                                    this.columnVisibility[key] = false;
                                }
                            }),
                        );

                        this.displayedColumns = ['code', 'name'];
                        this.dataSource = new MatTableDataSource<any>(this.caseTopics);
                        this.displayedColumns.forEach((column) => (this.columnVisibility[column] = true));
                    } else {
                        this.displayedColumns = [];
                        this.dataSource.data = [];
                        this.columnVisibility = {};
                    }
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
            width: '60%',
            maxWidth: '90vw',
            data: { mode, caseTopic },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllCaseTopic();
            }
        });
    }
}
