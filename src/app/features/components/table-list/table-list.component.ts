import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faEdit, faEye, faGear, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrl: './table-list.component.scss',
})
export class TableListComponent implements OnInit, OnChanges {
    @Input() title: string = '';
    @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    @Input() displayedColumns: string[] = [];
    @Input() isAction: boolean = false;
    @Input() isShowTool: boolean = false;

    @Output() view: EventEmitter<any> = new EventEmitter<any>();
    @Output() edit: EventEmitter<any> = new EventEmitter<any>();
    @Output() delete: EventEmitter<any> = new EventEmitter<any>();

    includesDate: string[] = ['createdAt', 'modityAt', 'lastLogin', 'startDate', 'endDate'];
    includesRole: string[] = ['role'];
    includesProfile: string[] = ['profile'];
    includesStatus: string[] = ['isActive'];
    includesColor: string[] = ['color'];

    newDataSouce: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    currentPage: number = 1;
    totalPages: number = 1;
    pages: any[] = [];
    pageSize: number = 5;
    pageSizeOptions = [5, 10, 25, 100];

    faGear = faGear;
    faEye = faEye;
    faEdit = faEdit;
    faTrash = faTrash;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    constructor(private socketIO: SocketIoService) {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        this.updatePages();
    }

    onClickView(element: any): void {
        this.view.emit(element);
    }

    onClickEdit(element: any): void {
        this.edit.emit(element);
    }

    onClickDelete(element: any): void {
        this.delete.emit(element);
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    getStatusOnline(userId?: string): boolean {
        return this.socketIO.getStatusOnline(userId);
    }

    pageChange(page: number): void {
        if (page < 1 || page > this.totalPages) {
            return;
        }
        this.currentPage = page;
        this.updatePages();
    }

    pageSizeChange(): void {
        this.currentPage = 1;
        this.updatePages();
    }

    updatePages(): void {
        this.newDataSouce = this.dataSource;
        this.totalPages = Math.ceil(this.dataSource.filteredData.length / this.pageSize);

        const startIndex = this.pageSize * (this.currentPage - 1);
        const endIndex = Math.min(startIndex + this.pageSize, this.dataSource.filteredData.length);

        const dataToShow = this.newDataSouce.filteredData.slice(startIndex, endIndex);

        this.newDataSouce = new MatTableDataSource(dataToShow);

        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
}
