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
    @Output() deleteUserId: EventEmitter<string> = new EventEmitter<string>();

    ngOnInit(): void {}

    onDeletedMember(userId: string) {
        const index = this.members?.findIndex((user) => user.userId === userId);
        if (index !== undefined && index !== -1) {
            this.members?.splice(index, 1);
        }

        this.deleteUserId.emit(userId);
    }
}
