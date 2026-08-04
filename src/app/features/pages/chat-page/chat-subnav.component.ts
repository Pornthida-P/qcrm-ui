import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import { canAccessChatNav, ChatNavKey } from './chat-access';

@Component({
    selector: 'app-chat-subnav',
    template: `
        <div class="chat-subnav d-flex flex-wrap gap-2 mb-3">
            <a
                *ngFor="let item of visibleItems"
                class="btn btn-sm"
                [class.btn-blue]="active === item.key"
                [class.btn-outline-blue]="active !== item.key"
                [routerLink]="item.route"
                >{{ item.label | translate }}</a
            >
        </div>
    `,
})
export class ChatSubnavComponent implements OnInit {
    @Input() active: ChatNavKey = 'inbox';

    private readonly items: { key: ChatNavKey; label: string; route: string }[] = [
        { key: 'inbox', label: 'menu.chat.inbox', route: '/chat' },
        { key: 'monitor', label: 'menu.chat.monitor', route: '/chat/monitor' },
        { key: 'broadcast', label: 'menu.chat.broadcast', route: '/chat/broadcast' },
        { key: 'bot', label: 'menu.chat.bot', route: '/chat/bot' },
        { key: 'reports', label: 'menu.chat.reports', route: '/chat/reports' },
        { key: 'settings', label: 'menu.chat.settings', route: '/chat/settings' },
    ];

    visibleItems: { key: ChatNavKey; label: string; route: string }[] = [];
    private user: User | null = null;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.userService.getDataUser().subscribe((user) => {
            this.user = user;
            this.visibleItems = this.items.filter((item) => canAccessChatNav(item.key, this.user));
        });
    }
}
