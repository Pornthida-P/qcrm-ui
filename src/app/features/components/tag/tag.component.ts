import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { catchError, tap } from 'rxjs';
import { CalendarEventService } from 'src/app/services/calendar-event/calendar-event.service';
import { ModalTagService } from 'src/app/services/modal-tag/modal-tag.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarTag } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
    styleUrl: './tag.component.scss',
})
export class TagComponent implements OnInit {
    title = 'tag';
    tags: CalendarTag[] = [];
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<CalendarTag>();
    columnVisibility: { [key: string]: boolean } = {};
    showColumnMenu = false;
    isAction: boolean = false;
    userDatas: User | null = null;

    faGear = faGear;
    faPlusCircle = faPlusCircle;

    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }

    constructor(
        private calendarService: CalendarEventService,
        private sweetAlertService: SweetAlertService,
        private userService: UserService,
        private modalTagService: ModalTagService,
        private translate: TranslateService,
    ) {
        this.translate.setDefaultLang('th');
    }

    ngOnInit(): void {
        this.initzation();
    }

    initzation(): void {
        this.getUerData();
        this.calendarService.onRefrashTag().subscribe(() => {
            this.findAllTag();
        });
    }

    findAllTag(): void {
        this.calendarService
            .findAllTags()
            .pipe(
                tap((tags) => {
                    this.tags = tags;
                    if (this.tags && this.tags.length > 0) {
                        this.tags.forEach((tag) => {
                            Object.keys(tag).forEach((key) => {
                                this.columnVisibility[key] = false;
                            });
                        });

                        this.displayedColumns = ['tagName', 'description', 'color'];
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
        this.dataSource.filter = text.trim().toLowerCase();
    }

    onClickAdd() {
        this.modalTagService.openDialog('add');
    }

    onClickView(tag: CalendarTag) {
        this.modalTagService.openDialog('view', tag);
    }

    onClickEdit(tag: CalendarTag) {
        this.modalTagService.openDialog('edit', tag);
    }

    onClickDelete(tag: CalendarTag) {
        this.sweetAlertService
            .confirmSwal('warning', 'Warning', 'Are you sure you want to delete this tag?', 'Yes', 'No')
            .then((result: { isConfirmed: boolean }) => {
                if (result.isConfirmed) {
                    this.calendarService
                        .deleteTag(tag)
                        .pipe(
                            tap(() => {
                                this.sweetAlertService.getSwal('success', 'Success', 'Delete tag successfully.', false, '');
                                this.findAllTag();
                            }),
                            catchError((error) => {
                                this.sweetAlertService.handleError(error);
                                throw error;
                            }),
                        )
                        .subscribe(() => {});
                }
            });
    }
}
