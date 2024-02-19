import { Component } from '@angular/core';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { tap, catchError } from 'rxjs';
import { ModalTeamService } from 'src/app/services/modal-team/modal-team.service';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { Group } from 'src/app/shared/interface/group.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrl: './team.component.scss',
})
export class TeamComponent {
    title = 'จัดการทีม';

    faEdit = faEdit;
    faTrash = faTrash;
    faEye = faEye;

    isAction: boolean = false;
    groupMembers: Group[] = [];
    searchGroup: Group[] = [];
    dataUser?: User | null;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    constructor(
        private userService: UserService,
        private sweetalertService: SweetAlertService,
        private socketIO: SocketIoService,
        private modalTeamService: ModalTeamService,
    ) {}

    ngOnInit(): void {
        this.userService.getGroupOnRefrash().subscribe(() => {
            this.findAllGroup();
        });

        this.getDataUser();
    }

    findAllGroup() {
        this.userService
            .findAllGroups()
            .pipe(
                tap((groups: Group[]) => {
                    this.groupMembers = groups;
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    getDataUser() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.dataUser = res;
            this.isAction = res?.role.roleTitle.toLowerCase() === 'admin' ? true : false;
        });
    }

    onSearch(text: string) {
        if (!text) {
            this.searchGroup = [];
            return;
        }

        this.searchGroup = this.groupMembers.filter((group) => {
            return group.groupTitle.toLowerCase().includes(text.toLowerCase());
        });
    }

    onClickAdd() {
        this.modalTeamService.openDialog('add');
    }

    onClickView(group: Group) {
        this.modalTeamService.openDialog('view', group);
    }

    onClickEdit(group: Group) {
        this.modalTeamService.openDialog('edit', group);
    }

    onClickDelete(group: Group) {
        this.userService
            .deleteGroup(group.groupId)
            .pipe(
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {
                this.sweetalertService.getSwal('success', 'Success', 'Group has been deleted.', false, '');
            });
    }

    getStatusOnline(userId?: string): boolean {
        return this.socketIO.getStatusOnline(userId);
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
