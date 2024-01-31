import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    cardTypes = [
        { key: 'morningBrief', title: 'Morning Brief Cards' },
        { key: 'information', title: 'Information Cards' },
        { key: 'announcement', title: 'Announcement Cards' },
    ];
    cards: any[] = [
        {
            id: '1',
            title: 'ประกาศ 1',
            type: 'morningBrief',
            description: 'ข้อความประกาศ 1',
            attachment: [{ id: 1, fileType: '', fileUrl: '', fileName: 'Attachment 1', createDate: '2021-01-01', createById: '1' }],
            startDate: '2021-01-01',
            endDate: '2021-01-01',
            createAt: '2021-01-01T00:00:00',
            createById: '1',
        },
        {
            id: '2',
            title: 'ประกาศ 2',
            type: 'morningBrief',
            description: 'ข้อความประกาศ 2',
            attachment: [{ id: 1, fileType: '', fileUrl: '', fileName: 'Attachment 1', createDate: '2021-01-01', createById: '1' }],
            startDate: '2021-01-01',
            endDate: '2021-01-01',
            createAt: '2021-01-01T00:00:00',
            createById: '1',
        },
        {
            id: '3',
            title: 'ประกาศ 3',
            type: 'information',
            description: 'ข้อความประกาศ 3',
            attachment: [{ id: 1, fileType: '', fileUrl: '', fileName: 'Attachment 1', createDate: '2021-01-01', createById: '1' }],
            startDate: '2021-01-01',
            endDate: '2021-01-01',
            createAt: '2021-01-01T00:00:00',
            createById: '1',
        },
        {
            id: '4',
            title: 'ประกาศ 4',
            type: 'information',
            description: 'ข้อความประกาศ 4',
            attachment: [{ id: 1, fileType: '', fileUrl: '', fileName: 'Attachment 1', createDate: '2021-01-01', createById: '1' }],
            startDate: '2021-01-01',
            endDate: '2021-01-01',
            createAt: '2021-01-01T00:00:00',
            createById: '1',
        },
    ];

    getCardsByType(type: string): any[] {
        return this.cards.filter((card) => card.type === type);
    }
}
