import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faEdit, faEye, faGear, faRemove, faXmark } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarTag } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-tag-list',
    templateUrl: './tag-list.component.html',
    styleUrl: './tag-list.component.scss',
})
export class TagListComponent implements OnInit, OnChanges {
    @Input() tags: CalendarTag[] = [];

    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<CalendarTag>(this.tags);
    columnVisibility: { [key: string]: boolean } = {};
    showColumnMenu = false;
    isAction: boolean = false;
    userDatas: User | null = null;

    faGear = faGear;
    faEye = faEye;
    faEdit = faEdit;
    faXmark = faXmark;

    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }

    constructor(private userService: UserService) {}

    ngOnInit() {}

    ngOnChanges(): void {
        this.initzation();
    }

    initzation(): void {
        this.getUerData();
        if (this.tags && this.tags.length > 0) {
            this.displayedColumns = ['tagName', 'description', 'createdAt'];
            this.dataSource.data = this.tags.map((tag: any) =>
                this.displayedColumns.reduce((obj: any, key) => {
                    obj[key] = tag[key];
                    return obj;
                }, {} as CalendarTag),
            );
            this.displayedColumns.forEach((column) => (this.columnVisibility[column] = true));
        } else {
            this.displayedColumns = [];
            this.dataSource.data = [];
        }
    }

    getUerData(): void {
        this.userService.getDataUser().subscribe((user) => {
            this.userDatas = user;
            this.isAction = this.userDatas?.role?.roleTitle.toLowerCase() === 'admin' ? true : false;
        });
    }

    onSearch(text: string) {
        console.log('Search:', text);
    }

    setDisplayFields(fields: string[]): void {
        this.displayedColumns = fields;
        const allColumns = Object.keys(this.columnVisibility);
        allColumns.forEach((column) => {
            this.columnVisibility[column] = this.displayedColumns.includes(column);
        });
    }

    applyColumnVisibility(): void {
        const displayedColumnsTemp: string[] = [];

        Object.keys(this.columnVisibility).forEach((column) => {
            if (this.columnVisibility[column]) {
                displayedColumnsTemp.push(column);
            }
        });

        this.displayedColumns = displayedColumnsTemp;
        this.dataSource.data = this.tags.map((tag: any) =>
            displayedColumnsTemp.reduce((obj: any, key: any) => {
                obj[key] = tag[key];
                return obj;
            }, {} as CalendarTag),
        );

        this.showColumnMenu = false;
    }

    onClickView(tag: CalendarTag) {
        console.log('View:', tag);
    }

    onClickEdit(tag: CalendarTag) {
        console.log('Edit:', tag);
    }

    onClickDelete(tag: CalendarTag) {
        console.log('Delete:', tag);
    }
}
