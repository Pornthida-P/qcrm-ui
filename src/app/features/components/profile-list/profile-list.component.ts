import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-profile-list',
    templateUrl: './profile-list.component.html',
    styleUrl: './profile-list.component.scss',
})
export class ProfileListComponent implements OnInit {
    @Input() members?: User[] = [];
    @Input() mode?: 'view' | 'edit' | 'add';
    @Input() isShowToolbar?: boolean = false;
    @Input() isBackground?: boolean = true;

    @Output() deleteUserId: EventEmitter<User> = new EventEmitter<User>();
    @Output() editUserId: EventEmitter<User> = new EventEmitter<User>();
    @Output() viewUserId: EventEmitter<User> = new EventEmitter<User>();

    constructor() {}

    ngOnInit(): void {}

    onDeleted(member: User) {
        this.deleteUserId.emit(member);

        const index = this.members?.findIndex((user) => user.userId === member.userId);
        if (index !== undefined && index !== -1) {
            this.members?.splice(index, 1);
        }
    }

    onClickView(member: User) {
        this.viewUserId.emit(member);
    }

    onClickEdit(member: User) {
        this.editUserId.emit(member);
    }
}
