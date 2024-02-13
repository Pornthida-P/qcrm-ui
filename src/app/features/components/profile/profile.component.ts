import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalUserService } from 'src/app/services/modal-user/modal-user.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
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
    @Output() deleteUserId: EventEmitter<string> = new EventEmitter<string>();

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    faEye = faEye;
    faXmark = faXmark;

    constructor(private sweetAlertService: SweetAlertService, private modalUserService: ModalUserService) {}

    ngOnInit(): void {}

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    onClickViewProfile(member: User | undefined) {
        this.modalUserService.openDialog('view', member);
    }

    onClickDeleteProfile(member: User | undefined) {
        if (member?.userId) {
            this.deleteUserId.emit(member.userId);
        } else {
            this.sweetAlertService.getSwal('warning', 'Warning Member', 'User ID is not found please try again.', false, '');
        }
    }
}
