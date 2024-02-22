import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faEdit, faEye, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';

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

    faGear = faGear;
    faEye = faEye;
    faEdit = faEdit;
    faXmark = faXmark;

    constructor() {}

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
}
