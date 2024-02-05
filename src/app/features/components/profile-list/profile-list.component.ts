import { Component, Input } from '@angular/core';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-profile-list',
    templateUrl: './profile-list.component.html',
    styleUrl: './profile-list.component.scss',
})
export class ProfileListComponent {
    @Input() member?: User;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
