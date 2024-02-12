import { Component } from '@angular/core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { tap, catchError } from 'rxjs';
import { ModalTeamService } from 'src/app/services/modal-team/modal-team.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { Group } from 'src/app/shared/interface/group.interface';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrl: './team.component.scss',
})
export class TeamComponent {
    title = 'Group Management';

    faEdit = faEdit;
    faTrash = faTrash;
    groupMembers: Group[] = [];

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    constructor(
        private userService: UserService,
        private sweetalertService: SweetAlertService,
        private modalTeamService: ModalTeamService,
    ) {}

    ngOnInit(): void {
        this.userService.getGroupOnRefrash().subscribe(() => {
            this.findAllGroup();
        });
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

    onClickAdd() {
        this.modalTeamService.openDialog('add');
    }

    onClickEdit(group: any) {
        this.modalTeamService.openDialog('edit', group);
    }

    removeTeamMember(teamMember: any) {
        console.log('Removing team member:', teamMember);
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
