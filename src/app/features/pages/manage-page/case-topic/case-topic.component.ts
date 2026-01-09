import { Component } from '@angular/core';

@Component({
    selector: 'app-case-topic',
    standalone: false,
    templateUrl: './case-topic.component.html',
    styleUrl: './case-topic.component.scss',
})
export class CaseTopicComponent {
    title: string = 'case-code-type';

    activeTab: 'case-code' | 'case-type' | 'service-group' | 'service-type' | 'service-sub-type' | 'sentiment' = 'case-code';

    tabs = [
        { id: 'case-code', label: 'menu.caseCode', icon: 'fa-code' },
        { id: 'case-type', label: 'menu.caseType', icon: 'fa-folder' },
        { id: 'service-group', label: 'menu.serviceGroup', icon: 'fa-layer-group' },
        { id: 'service-type', label: 'menu.serviceType', icon: 'fa-cog' },
        { id: 'service-sub-type', label: 'menu.serviceSubType', icon: 'fa-cogs' },
        { id: 'sentiment', label: 'menu.sentiment', icon: 'fa-face-smile' },
    ];

    switchTab(tabId: string): void {
        this.activeTab = tabId as any;
    }
}
