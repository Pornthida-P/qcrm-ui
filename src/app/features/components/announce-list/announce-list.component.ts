import { Component, OnInit } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AnnounceCard } from 'src/app/shared/interface/announce.interface';

@Component({
    selector: 'app-announce-list',
    templateUrl: './announce-list.component.html',
    styleUrl: './announce-list.component.scss',
})
export class AnnounceListComponent implements OnInit {
    cardTypes = [
        { key: 'morningBrief', title: 'Morning Brief Cards' },
        { key: 'information', title: 'Information Cards' },
        { key: 'announcement', title: 'Announcement Cards' },
    ];
    cards: AnnounceCard[] = [
        {
            id: '1',
            title: 'ประกาศ 1',
            type: 'morningBrief',
            description: 'ข้อความประกาศ 1',
            attachment: [{ id: 1, fileType: 'image', fileUrl: '', fileName: 'Attachment 1', createDate: '2021-01-01', createById: '1' }],
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
            attachment: [{ id: 1, fileType: 'png', fileUrl: '', fileName: 'Attachment 1', createDate: '2021-01-01', createById: '1' }],
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
            attachment: [{ id: 1, fileType: 'PDF', fileUrl: '', fileName: 'Attachment 1', createDate: '2021-01-01', createById: '1' }],
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
            attachment: [{ id: 1, fileType: 'image', fileUrl: '', fileName: 'Attachment 1', createDate: '2021-01-01', createById: '1' }],
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
            attachment: [{ id: 1, fileType: 'image', fileUrl: '', fileName: 'Attachment 1', createDate: '2021-01-01', createById: '1' }],
            startDate: '2021-01-01',
            endDate: '2021-01-01',
            createAt: '2021-01-01T00:00:00',
            createById: '1',
        },
    ];

    faPlus = faPlusCircle;

    getCardsByType(type: string): any[] {
        const item = this.cards.filter((card) => card.type === type);
        return item;
    }
    ngOnInit(): void {}
}
