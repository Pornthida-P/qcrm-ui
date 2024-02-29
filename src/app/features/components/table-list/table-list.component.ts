import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faEdit, faEye, faGear, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';

@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrl: './table-list.component.scss',
})
export class TableListComponent implements OnInit, OnChanges {
    @ViewChild(MatPaginator) paginator?: MatPaginator;

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

    faGear = faGear;
    faEye = faEye;
    faEdit = faEdit;
    faTrash = faTrash;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    constructor(private socketIO: SocketIoService) {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.paginator._intl.itemsPerPageLabel = 'เลือกจำนวนที่แสดง';
        }
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
}
