import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { catchError, tap } from 'rxjs';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { ModalUserService } from 'src/app/services/modal-user/modal-user.service';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-member',
    templateUrl: './member.component.html',
    styleUrl: './member.component.scss',
})
export class MemberComponent implements OnInit {
    title: string = 'member';
    members: User[] = [];
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<User>();
    columnVisibility: { [key: string]: boolean } = {};
    showColumnMenu = false;
    isAction: boolean = false;
    userData: User | null = null;

    faGear = faGear;
    faPlusCircle = faPlusCircle;

    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }

    constructor(
        private socketIO: SocketIoService,
        private userService: UserService,
        private sweetalertService: SweetAlertService,
        private modalUserService: ModalUserService,
        private auditLogService: AuditLogService,
        private translate: TranslateService,
    ) {}

    ngOnInit(): void {
        this.initzation();
    }

    initzation(): void {
        this.userService.getMemberOnRefrash().subscribe(() => {
            this.findAllMember();
        });
        this.getUserData();
    }

    findAllMember() {
        this.userService
            .getAllUser()
            .pipe(
                tap((users: User[]) => {
                    this.members = users;

                    if (this.members && this.members.length > 0) {
                        this.members.forEach((member) => {
                            Object.keys(member).forEach((key) => {
                                this.columnVisibility[key] = false;
                            });
                        });

                        this.displayedColumns = ['username', 'role', 'profile', 'isActive'];
                        this.dataSource = new MatTableDataSource<User>(this.members);

                        this.displayedColumns.forEach((column) => (this.columnVisibility[column] = true));
                    } else {
                        this.displayedColumns = [];
                        this.dataSource.data = [];
                    }
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    getUserData() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAction = res?.role.roleTitle.toLowerCase().includes('admin') ?? false;
        });
    }

    onSearch(text: string) {
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
        this.dataSource = new MatTableDataSource<User>(this.members);

        this.showColumnMenu = false;
    }

    onClickAdd() {
        this.modalUserService.openDialog('add');
    }

    onClickView(member: User) {
        this.modalUserService.openDialog('view', member);
    }

    onClickEdit(member: User) {
        this.modalUserService.openDialog('edit', member);
    }

    onClickDelete(member: User) {
        this.sweetalertService
            .confirmSwal(
                'warning',
                this.translate.instant('alert.warning'),
                this.translate.instant('alert.confirmDeleteUser'),
                this.translate.instant('alert.yes'),
                this.translate.instant('alert.no'),
            )
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    this.userService
                        .deleteUser(member.userId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.success('alert.deleteUserSuccess');
                                this.findAllMember();
                                this.auditLogService.log(
                                    '',
                                    'Account',
                                    '',
                                    'Delete',
                                    `User : ${member.username}, Email: ${member.email}`,
                                    `Success`,
                                );
                            }),
                            catchError((error) => {
                                this.auditLogService.log(
                                    '',
                                    'Account',
                                    '',
                                    'Delete',
                                    `User : ${member.username}, Email: ${member.email}`,
                                    `Failed, Error ${error}`,
                                );
                                this.sweetalertService.handleError(error);
                                throw error;
                            }),
                        )
                        .subscribe(() => {});
                }
            });
    }
}
