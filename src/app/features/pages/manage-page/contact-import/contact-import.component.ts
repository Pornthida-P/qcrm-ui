import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ContactImportManagementComponent } from 'src/app/features/modals/contact-import-management/contact-import-management.component';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { CallService } from 'src/app/services/call/call.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-contact-import',
    standalone: false,
    templateUrl: './contact-import.component.html',
    styleUrl: './contact-import.component.scss',
})
export class ContactImportComponent {
    title: string = 'contact-import';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = [];
    isAction: boolean = false;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    columnVisibility: { [key: string]: boolean } = {};
    ignoreColumns: string[] = [
        'caseId',
        'contactId',
        'number',
        'channelId',
        'caseTopicId',
        'caseTopicCode',
        'caseSubjectId',
        'operationType',
        'priority',
        'status',
        'solution',
        'email',
        'source',
        'assignedAt',
        'createdAt',
        'createdById',
        'modifiedAt',
        'modifiedById',
        'isDeleted',
        'assignedUserId',
        'attachment',
        'script',
        'contactNumberId',
        'callStatus',
        'callStatusId',
        'callStatusChangedAt',
        'type',
    ];
    showColumnMenu = false;
    contactListImports: any[] = [];
    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }
    userId: string = '';
    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    caseList: any[] = [];
    constructor(private dialog: MatDialog, private callListService: CallListService, private sweetalertService: SweetAlertService) {}

    ngOnInit() {
        if (this.userData.role.roleTitle.toLowerCase() === 'super admin' || this.userData.role.roleTitle.toLowerCase() === 'admin') {
            this.userId = 'all';
        } else {
            this.userId = this.userData.userId;
        }
        this.findAllContactList();
    }

    onClickView(data: any) {
        this.openDialog('view', data);
    }

    onClickEdit(data: any) {
        this.openDialog('edit', data);
    }

    onClickDelete(data: any) {
        console.log(data);
    }

    onClickAdd() {
        this.openDialog('add');
    }

    onSearch(text: string) {
        console.log('text: ', text);
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
        this.dataSource = new MatTableDataSource<any>(this.contactListImports);

        this.showColumnMenu = false;
    }

    openDialog(mode: 'add' | 'view' | 'edit', contactListImport?: any): void {
        const dialogRef = this.dialog.open(ContactImportManagementComponent, {
            width: '60%',
            maxWidth: '90vw',
            data: { mode, contactListImport },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllContactList();
            }
        });
    }

    findAllContactList() {
        this.callListService
            .getCaseListByUserId(this.userId)
            .pipe(
                tap((caseList: any) => {
                    this.caseList = caseList;

                    if (this.caseList && this.caseList.length > 0) {
                        this.columnVisibility = {};
                        const columns = new Set<string>();

                        this.caseList.forEach((caseItem) => {
                            Object.keys(caseItem).forEach((key) => {
                                if (!this.ignoreColumns.includes(key)) {
                                    columns.add(key);
                                }
                            });
                        });

                        this.displayedColumns = Array.from(columns);
                        this.displayedColumns.forEach((col) => (this.columnVisibility[col] = true));
                        this.dataSource = new MatTableDataSource<any>(this.caseList);
                    } else {
                        this.displayedColumns = [];
                        this.columnVisibility = {};
                        this.dataSource = new MatTableDataSource<any>([]);
                    }
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }
}
