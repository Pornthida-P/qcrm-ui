import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ContactImportManagementComponent } from 'src/app/features/modals/contact-import-management/contact-import-management.component';

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
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    columnVisibility: { [key: string]: boolean } = {};
    ignoreColumns: string[] = [
        'contactImportId',
        'modityAt',
        'modifiedById',
        'modifiedAt',
        'createdById',
        'isDeleted',
        'source',
        'subjects',
    ];
    showColumnMenu = false;
    contactListImports: any[] = [];
    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }

    constructor(private dialog: MatDialog) {}

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

    findAllContactList() {}
}
