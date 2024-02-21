import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faEdit, faEye, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarTag } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrl: './table-list.component.scss',
})
export class TableListComponent implements OnInit {
    @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    @Input() displayedColumns: string[] = [];
    @Input() isAction: boolean = false;
    @Input() isShowTool: boolean = false;

    @Output() view: EventEmitter<any> = new EventEmitter<any>();
    @Output() edit: EventEmitter<any> = new EventEmitter<any>();
    @Output() delete: EventEmitter<any> = new EventEmitter<any>();

    faGear = faGear;
    faEye = faEye;
    faEdit = faEdit;
    faXmark = faXmark;

    constructor() {}

    ngOnInit(): void {}

    onClickView(element: any): void {
        this.view.emit(element);
    }

    onClickEdit(element: any): void {
        this.edit.emit(element);
    }

    onClickDelete(element: any): void {
        this.delete.emit(element);
    }
}
