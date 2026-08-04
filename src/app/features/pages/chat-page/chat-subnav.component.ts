import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-chat-subnav',
    template: `
        <div class="chat-subnav d-flex flex-wrap gap-2 mb-3">
            <a class="btn btn-sm" [class.btn-blue]="active === 'inbox'" [class.btn-outline-blue]="active !== 'inbox'" routerLink="/chat"
                >Inbox</a
            >
            <a
                class="btn btn-sm"
                [class.btn-blue]="active === 'monitor'"
                [class.btn-outline-blue]="active !== 'monitor'"
                routerLink="/chat/monitor"
                >Monitor</a
            >
            <a
                class="btn btn-sm"
                [class.btn-blue]="active === 'broadcast'"
                [class.btn-outline-blue]="active !== 'broadcast'"
                routerLink="/chat/broadcast"
                >Broadcast</a
            >
            <a
                class="btn btn-sm"
                [class.btn-blue]="active === 'bot'"
                [class.btn-outline-blue]="active !== 'bot'"
                routerLink="/chat/bot"
                >Bot</a
            >
            <a
                class="btn btn-sm"
                [class.btn-blue]="active === 'reports'"
                [class.btn-outline-blue]="active !== 'reports'"
                routerLink="/chat/reports"
                >Reports</a
            >
            <a
                class="btn btn-sm"
                [class.btn-blue]="active === 'settings'"
                [class.btn-outline-blue]="active !== 'settings'"
                routerLink="/chat/settings"
                >Settings</a
            >
        </div>
    `,
})
export class ChatSubnavComponent {
    @Input() active: 'inbox' | 'monitor' | 'reports' | 'settings' | 'broadcast' | 'bot' = 'inbox';
}
