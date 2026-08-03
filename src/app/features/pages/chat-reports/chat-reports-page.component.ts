import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-chat-reports-page',
    templateUrl: './chat-reports-page.component.html',
})
export class ChatReportsPageComponent implements OnInit {
    dashboard: any = null;
    summary: any = null;

    constructor(
        private chatService: ChatService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        if (!environment.features?.chatEnabled) {
            this.router.navigate(['/home']);
            return;
        }
        this.reload();
    }

    reload(): void {
        this.chatService.getDashboard().subscribe((d) => (this.dashboard = d));
        const end = Date.now();
        const start = end - 7 * 24 * 60 * 60 * 1000;
        this.chatService.getReportSummary(start, end).subscribe((s) => (this.summary = s));
    }
}
