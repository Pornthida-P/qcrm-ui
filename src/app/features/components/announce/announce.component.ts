import { Component } from '@angular/core';
import { faBullhorn, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Announce } from 'src/app/shared/interface/announce.interface';

@Component({
    selector: 'app-announce',
    templateUrl: './announce.component.html',
    styleUrl: './announce.component.scss',
})
export class AnnounceComponent {
    faAnnounce = faBullhorn;

    announcements: Announce[] = [];

    marqueeText = '';

    faEdit = faEdit;

    ngOnInit(): void {
        this.announcements = [
            {
                id: '1',
                title: 'ประกาศ 1',
                description: 'ข้อความประกาศ 1',
                startDate: '2021-01-01',
                endDate: '2021-01-01',
                createAt: '2021-01-01T00:00:00',
                createById: '1',
            },
        ];

        this.updateMarqueeText();
    }

    updateMarqueeText() {
        if (this.announcements.length > 0) {
            this.marqueeText = this.announcements
                .map((announce, index, array) => {
                    if (index < array.length - 1) {
                        return `<strong>${announce.title}</strong> : ${announce.description} <span class="marquee-space"></span>`;
                    } else {
                        return `<strong>${announce.title}</strong> : ${announce.description}`;
                    }
                })
                .join('');
        } else {
            this.marqueeText = '';
        }
    }
}
