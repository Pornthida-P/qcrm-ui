import { Component, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faEye, faEdit, faXmark } from '@fortawesome/free-solid-svg-icons';
import { catchError, tap } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { ModalTagService } from 'src/app/services/modal-tag/modal-tag.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarTag } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
    styleUrl: './tag.component.scss',
})
export class TagComponent implements OnInit, OnChanges {
    title = 'แท็ก';
    tags: CalendarTag[] = [];
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<CalendarTag>(this.tags);
    initialColumnVisibility: { [key: string]: boolean } = {
        tagId: false,
        tagName: false,
        description: false,
        createdAt: false,
        createdById: false,
        modifyAt: false,
        modifyById: false,
    };
    columnVisibility: { [key: string]: boolean } = { ...this.initialColumnVisibility };
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

    constructor(
        private calendarService: CalendarEventService,
        private sweetAlertService: SweetAlertService,
        private userService: UserService,
        private modalTagService: ModalTagService,
    ) {}

    ngOnInit(): void {
        this.initzation();
    }

    ngOnChanges(): void {
        this.initzation();
    }

    initzation(): void {
        this.findAllTag();
        this.getUerData();
    }

    findAllTag(): void {
        this.calendarService
            .findAllTags()
            .pipe(
                tap((tags) => {
                    this.tags = tags;
                    if (this.tags && this.tags.length > 0) {
                        this.displayedColumns = ['tagName', 'description', 'createdAt'];
                        this.dataSource = new MatTableDataSource<CalendarTag>(this.tags);

                        this.displayedColumns.forEach((column) => (this.columnVisibility[column] = true));
                    } else {
                        this.displayedColumns = [];
                        this.dataSource.data = [];
                    }
                }),
                catchError((error) => {
                    this.sweetAlertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    getUerData(): void {
        this.userService.getDataUser().subscribe((user) => {
            this.userDatas = user;
            this.isAction = this.userDatas?.role?.roleTitle.toLowerCase() === 'admin' ? true : false;
        });
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
        this.dataSource = new MatTableDataSource<CalendarTag>(this.tags);

        this.showColumnMenu = false;
    }

    onSearch(text: string) {
        console.log('Search:', text);
    }

    onClickAdd() {
        console.log('Add');
    }

    onClickView(tag: CalendarTag) {
        console.log('View:', tag);
        this.modalTagService.openDialog('view', tag);
    }

    onClickEdit(tag: CalendarTag) {
        console.log('Edit:', tag);
        this.modalTagService.openDialog('edit', tag);
    }

    onClickDelete(tag: CalendarTag) {
        this.dataSource.data = this.dataSource.data.filter((item) => item !== tag);
    }
}
