import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ModalUserService } from 'src/app/services/modal-user/modal-user.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-member',
    templateUrl: './member.component.html',
    styleUrl: './member.component.scss',
})
export class MemberComponent implements OnInit {
    title: string = 'จัดการสมาชิก';

    userData?: User | null;
    members?: User[];
    searchResult?: User[];
    isAction: boolean = false;

    constructor(
        private userService: UserService,
        private sweetalertService: SweetAlertService,
        private modalUserService: ModalUserService,
    ) {}

    ngOnInit(): void {
        this.userService.getMemberOnRefrash().subscribe(() => {
            this.findAllMember();
        });
    }

    findAllMember() {
        this.userService
            .getAllUser()
            .pipe(
                tap((users: User[]) => {
                    this.members = users;
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {});
    }

    onSearch(text: string) {
        if (!text) {
            this.searchResult = [];
            return;
        }

        this.searchResult = this.members?.filter(
            (member) =>
                member.username.toLowerCase().includes(text.toLowerCase()) || member.email.toLowerCase().includes(text.toLowerCase()),
        );
    }

    onClickAdd() {
        this.modalUserService.openDialog('add');
    }
}
