import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-menagement-account',
    templateUrl: './menagement-account.component.html',
    styleUrl: './menagement-account.component.scss',
})
export class MenagementAccountComponent implements OnInit {
    userData: User = {
        userId: '2',
        username: 'Jukkrit',
        email: 'jukkrit@convergence.co.th',
        profile: '',
        group: 'developer',
        role: 'agent',
    };

    profileError: string = '/assets/nea-qcrm-ui/image/profile/user.jpg';

    ngOnInit(): void {}

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
