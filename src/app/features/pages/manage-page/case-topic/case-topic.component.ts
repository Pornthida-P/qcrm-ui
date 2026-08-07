import { Component } from '@angular/core';

@Component({
    selector: 'app-case-topic',
    standalone: false,
    templateUrl: './case-topic.component.html',
    styleUrl: './case-topic.component.scss',
})
export class CaseTopicComponent {
    title: string = 'case-topic';

    activeTab: 'case-topic' | 'case-subject' | 'case-type' | 'sentiment' = 'case-topic';

    tabs = [
        { id: 'case-topic', label: 'menu.caseTopic', icon: 'fa-bookmark' },
        { id: 'case-subject', label: 'menu.caseSubject', icon: 'fa-file-lines' },
        { id: 'case-type', label: 'menu.caseType', icon: 'fa-folder' },
        { id: 'sentiment', label: 'menu.sentiment', icon: 'fa-face-smile' },
    ];

    switchTab(tabId: string): void {
        this.activeTab = tabId as any;
    }
}
