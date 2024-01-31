import { Component } from '@angular/core';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-announce',
    templateUrl: './announce.component.html',
    styleUrl: './announce.component.scss',
})
export class AnnounceComponent {
    faAnnounce = faBullhorn;

    announcements = [
        {
            announceTitle: 'ประกาศ 1',
            description: 'ข้อความประกาศ 1',
        },
        {
            announceTitle: 'ประกาศ 2',
            description: 'ข้อความประกาศ 2',
        },
    ];

    marqueeText = '';

    ngOnInit(): void {
        this.updateMarqueeText();
    }

    updateMarqueeText() {
        if (this.announcements.length > 0) {
            this.marqueeText = this.announcements
                .map((announce, index, array) => {
                    if (index < array.length - 1) {
                        return `${announce.announceTitle} : ${announce.description} <span class="marquee-space">|</span>`;
                    } else {
                        return `${announce.announceTitle} : ${announce.description}`;
                    }
                })
                .join('');
        } else {
            this.marqueeText = '';
        }
    }
}
