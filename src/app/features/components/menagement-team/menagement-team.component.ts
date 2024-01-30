import { Component, OnInit } from '@angular/core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-menagement-team',
    templateUrl: './menagement-team.component.html',
    styleUrl: './menagement-team.component.scss',
})
export class MenagementTeamComponent implements OnInit {
    faEdit = faEdit;
    faTrash = faTrash;
    groupMembers: any[] = [];

    profileError: string = '/assets/nea-qcrm-ui/image/profile/user.jpg';

    ngOnInit(): void {
        this.groupMembers = [
            {
                groupId: '1',
                groupName: 'Developer',
                members: [
                    {
                        userId: '1',
                        username: 'admin',
                        email: 'admin@convergence.co.th',
                        profile: '',
                        group: 'developer',
                        role: 'admin',
                    },
                    {
                        userId: '2',
                        username: 'Jukkrit',
                        email: 'jukkrit@convergence.co.th',
                        profile: '',
                        group: 'developer',
                        role: 'agent',
                    },
                ],
            },
            {
                groupId: '2',
                groupName: 'Operation',
                members: [
                    {
                        userId: '1',
                        username: 'admin',
                        email: 'admin@convergence.co.th',
                        profile: '',
                        group: 'developer',
                        role: 'admin',
                    },
                ],
            },
        ];
    }

    editTeamMember(teamMember: any) {
        console.log('Editing team member:', teamMember);
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
