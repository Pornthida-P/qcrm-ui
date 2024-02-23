import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit, faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalUserService } from 'src/app/services/modal-user/modal-user.service';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
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

    @Output() deleteUserId: EventEmitter<User> = new EventEmitter<User>();
    @Output() editUserId: EventEmitter<User> = new EventEmitter<User>();
    @Output() viewUserId: EventEmitter<User> = new EventEmitter<User>();

    userData?: User | null;
    isAction: boolean = false;
    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    faEye = faEye;
    faEdit = faEdit;
    faXmark = faXmark;

    constructor(
        private sweetAlertService: SweetAlertService,
        private modalUserService: ModalUserService,
        private socketIO: SocketIoService,
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

    onClickView(member: User) {
        this.viewUserId.emit(member);
        this.modalUserService.openDialog('view', member);
    }

    onClickEdit(member: User) {
        this.editUserId.emit(member);
        this.modalUserService.openDialog('edit', member);
    }

    onClickDelete(member: User) {
        this.deleteUserId.emit(member);
    }

    getStatusOnline(userId?: string): boolean {
        return this.socketIO.getStatusOnline(userId);
    }
}
