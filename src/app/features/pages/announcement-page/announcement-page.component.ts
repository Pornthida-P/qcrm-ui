import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { catchError, tap } from 'rxjs';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { ModalAnnouncementService } from 'src/app/services/modal-announcement/modal-announcement.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { Announce } from 'src/app/shared/interface/announce.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-announcement-page',
    templateUrl: './announcement-page.component.html',
    styleUrl: './announcement-page.component.scss',
})
export class AnnouncementPageComponent {
    title: string = 'announcement';
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<Announce>();
    columnVisibility: { [key: string]: boolean } = {};
    announcements: Announce[] = [];
    showColumnMenu = false;
    isAction: boolean = false;
    userDatas: User | null = null;

    faPlusCircle = faPlusCircle;
    faGear = faGear;

    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }

    constructor(
        private sweetAlertService: SweetAlertService,
        private userService: UserService,
        private announcementService: AnnouncementService,
        private modalAnnouncementService: ModalAnnouncementService,
    ) {}

    ngOnInit(): void {
        this.initzation();
    }

    initzation(): void {
        this.getUerData();
        this.announcementService.onRefreshData().subscribe(() => {
            this.findAllAnnouncement();
        });
    }

    findAllAnnouncement(): void {
        this.announcementService
            .findAll()
            .pipe(
                tap((announcement) => {
                    this.announcements = announcement;
                    if (this.announcements && this.announcements.length > 0) {
                        this.announcements.forEach((announce) => {
                            Object.keys(announce).forEach((key) => {
                                this.columnVisibility[key] = false;
                            });
                        });

                        this.displayedColumns = ['announceTitle', 'description', 'startDate', 'endDate'];
                        this.dataSource = new MatTableDataSource<Announce>(this.announcements);

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
        this.dataSource = new MatTableDataSource<Announce>(this.announcements);

        this.showColumnMenu = false;
    }

    onClickView(announce: Announce) {
        this.modalAnnouncementService.openDialog('view', announce);
    }

    onClickEdit(announce: Announce) {
        this.modalAnnouncementService.openDialog('edit', announce);
    }

    onClickDelete(Announce: Announce) {
        this.sweetAlertService
            .confirmSwal('warning', 'Warning', 'Are you sure you want to delete this announcement?', 'Yes', 'No')
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    this.announcementService.delete(Announce.announceId).subscribe(() => {});
                }
            });
    }

    onSearch(text: string) {
        this.dataSource.filter = text.trim().toLowerCase();
    }

    onClickAdd() {
        this.modalAnnouncementService.openDialog('add');
    }
}
