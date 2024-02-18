import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit, faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalUserService } from 'src/app/services/modal-user/modal-user.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
    @Input() member?: User;
    @Input() mode?: 'view' | 'edit' | 'add';
    @Input() isShowToolbar?: boolean = false;
    @Input() isBackground?: boolean = true;
    @Output() deleteUserId: EventEmitter<string> = new EventEmitter<string>();

    userData?: User | null;
    isAction: boolean = false;
    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    faEye = faEye;
    faEdit = faEdit;
    faXmark = faXmark;

    constructor(
        private sweetAlertService: SweetAlertService,
        private modalUserService: ModalUserService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.getUserData();
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    getUserData() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAction = res?.role.roleTitle.toLowerCase() === 'admin' ? true : false;
        });
    }

    onClickView(member: User | undefined) {
        this.modalUserService.openDialog('view', member);
    }

    onClickEdit(member: User | undefined) {
        this.modalUserService.openDialog('edit', member);
    }

    onClickDelete(member: User | undefined) {
        if (member?.userId) {
            this.deleteUserId.emit(member.userId);
        } else {
            this.sweetAlertService.getSwal('warning', 'Warning Member', 'User ID is not found please try again.', false, '');
        }
    }
}
