import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-chat-subnav',
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
            .chat-subnav .btn-primary {
                background-color: var(--color-blue-dark) !important;
                border-color: var(--color-blue-dark) !important;
                color: #fff !important;
            }

            .chat-subnav .btn-primary:hover,
            .chat-subnav .btn-primary:focus,
            .chat-subnav .btn-primary:active {
                background-color: #020b80 !important;
                border-color: #020b80 !important;
                color: #fff !important;
            }

            .chat-subnav .btn-outline-primary {
                color: var(--color-blue-dark) !important;
                border-color: var(--color-blue-dark) !important;
                background-color: transparent !important;
            }

            .chat-subnav .btn-outline-primary:hover,
            .chat-subnav .btn-outline-primary:focus,
            .chat-subnav .btn-outline-primary:active {
                color: #fff !important;
                background-color: var(--color-blue-dark) !important;
                border-color: var(--color-blue-dark) !important;
            }
        `,
    ],
    template: `
        <div class="chat-subnav d-flex flex-wrap gap-2 mb-3">
            <a class="btn btn-sm" [class.btn-primary]="active === 'inbox'" [class.btn-outline-primary]="active !== 'inbox'" routerLink="/chat"
                >Inbox</a
            >
            <a
                class="btn btn-sm"
                [class.btn-primary]="active === 'monitor'"
                [class.btn-outline-primary]="active !== 'monitor'"
                routerLink="/chat/monitor"
                >Monitor</a
            >
            <a
                class="btn btn-sm"
                [class.btn-primary]="active === 'broadcast'"
                [class.btn-outline-primary]="active !== 'broadcast'"
                routerLink="/chat/broadcast"
                >Broadcast</a
            >
            <a
                class="btn btn-sm"
                [class.btn-primary]="active === 'bot'"
                [class.btn-outline-primary]="active !== 'bot'"
                routerLink="/chat/bot"
                >Bot</a
            >
            <a
                class="btn btn-sm"
                [class.btn-primary]="active === 'reports'"
                [class.btn-outline-primary]="active !== 'reports'"
                routerLink="/chat/reports"
                >Reports</a
            >
            <a
                class="btn btn-sm"
                [class.btn-primary]="active === 'settings'"
                [class.btn-outline-primary]="active !== 'settings'"
                routerLink="/chat/settings"
                >Settings</a
            >
        </div>
    `,
})
export class ChatSubnavComponent {
    @Input() active: 'inbox' | 'monitor' | 'reports' | 'settings' | 'broadcast' | 'bot' = 'inbox';
}
