import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-menagement-account',
    templateUrl: './menagement-account.component.html',
    styleUrl: './menagement-account.component.scss',
})
export class MenagementAccountComponent implements OnInit {
    userData?: User | null;
    mode: 'add' | 'view' | 'edit' = 'edit';

    profileError: string = './assets/qcrm-ui/image/profile/user.jpg';

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.getDataUser();
    }

    getDataUser() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
        });
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
