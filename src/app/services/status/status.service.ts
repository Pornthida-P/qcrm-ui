import { Injectable } from '@angular/core';
import { colors, statusPalette } from 'src/app/shared/theme/colors';

export interface StatusStyle {
    color: string;
    backgroundColor: string;
    icon: string;
}

@Injectable({
    providedIn: 'root',
})
export class StatusService {
    private statusColors: { [key: string]: StatusStyle } = {
        open: {
            color: colors.white,
            // ทองอ่อน — เคสใหม่ ต้องมาจัดการ
            backgroundColor: '#c9a227',
            icon: 'fa-solid fa-folder-open',
        },
        pending: {
            color: colors.white,
            // ส้มอมน้ำตาล — รอดำเนินการ / ติดตาม
            backgroundColor: '#c17f4a',
            icon: 'fa-solid fa-hourglass-end',
        },
        closed: {
            color: colors.white,
            // เขียวอมฟ้า — เสร็จแล้ว
            backgroundColor: '#4a9a8a',
            icon: 'fa-solid fa-folder-closed',
        },
        cancelled: {
            color: colors.white,
            // เทา — ยกเลิก ไม่ต้องทำอะไร
            backgroundColor: '#64748b',
            icon: 'fa-solid fa-ban',
        },
        canceled: {
            color: colors.white,
            backgroundColor: '#64748b',
            icon: 'fa-solid fa-ban',
        },
    };

    private channelColors: { [key: string]: StatusStyle } = {
        voice: {
            color: colors.white,
            backgroundColor: colors.channelVoice,
            icon: 'fa-solid fa-phone',
        },
        call: {
            color: colors.white,
            backgroundColor: colors.channelVoice,
            icon: 'fa-solid fa-phone',
        },
        phone: {
            color: colors.white,
            backgroundColor: colors.channelVoice,
            icon: 'fa-solid fa-phone',
        },
        line: {
            color: colors.white,
            backgroundColor: colors.channelLine,
            icon: 'fa-brands fa-line',
        },
        facebook: {
            color: colors.white,
            backgroundColor: colors.channelFacebook,
            icon: 'fa-brands fa-facebook-messenger',
        },
        'facebook (comment)': {
            color: colors.white,
            backgroundColor: colors.channelFacebookComment,
            icon: 'fa-brands fa-facebook-f',
        },
        whatsapp: {
            color: colors.white,
            backgroundColor: colors.channelWhatsapp,
            icon: 'fa-brands fa-whatsapp',
        },
        tiktok: {
            color: colors.white,
            backgroundColor: colors.channelTiktok,
            icon: 'fa-brands fa-tiktok',
        },
    };

    private defaultColors = [...statusPalette];

    constructor() {}

    /** Map free-text channel name → known brand key */
    private resolveChannelKey(channelName: string): string | null {
        const n = channelName.toLowerCase().trim();
        if (!n) return null;

        if (n.includes('whatsapp') || n === 'wa') return 'whatsapp';
        if (n.includes('tiktok')) return 'tiktok';
        if (n.includes('facebook') && n.includes('comment')) return 'facebook (comment)';
        if (n.includes('facebook') || n.includes('messenger') || n.startsWith('fb')) return 'facebook';
        if (n.includes('line') && !n.includes('online')) return 'line';
        if (n.includes('voice') || n.includes('call') || n.includes('phone')) return 'voice';

        return this.channelColors[n] ? n : null;
    }

    getStatusStyle(statusName: string): StatusStyle {
        if (!statusName) {
            return this.getDefaultStyle();
        }

        const normalizedName = statusName.toLowerCase().trim();

        if (this.statusColors[normalizedName]) {
            return this.statusColors[normalizedName];
        }

        const colorIndex = this.hashString(normalizedName) % this.defaultColors.length;
        return {
            color: colors.white,
            backgroundColor: this.defaultColors[colorIndex],
            icon: 'fa-solid fa-circle',
        };
    }

    getStatusColorByIndex(index: number): StatusStyle {
        const palette = [...statusPalette];
        const icons = [
            'fa-solid fa-folder-open',
            'fa-solid fa-hourglass-end',
            'fa-solid fa-folder-closed',
            'fa-solid fa-ban',
            'fa-solid fa-circle-pause',
            'fa-solid fa-spinner',
            'fa-solid fa-circle-check',
            'fa-solid fa-circle',
        ];

        return {
            color: colors.white,
            backgroundColor: palette[index % palette.length],
            icon: icons[index % icons.length],
        };
    }

    getStatusBgColor(statusName: string): string {
        return this.getStatusStyle(statusName).backgroundColor;
    }

    getStatusIcon(statusName: string): string {
        return this.getStatusStyle(statusName).icon;
    }

    getChannelStyle(channelName: string): StatusStyle {
        if (!channelName) {
            return this.getDefaultChannelStyle();
        }

        const key = this.resolveChannelKey(channelName);
        if (key && this.channelColors[key]) {
            return this.channelColors[key];
        }

        const colorIndex = this.hashString(channelName.toLowerCase().trim()) % this.defaultColors.length;
        return {
            color: colors.white,
            backgroundColor: this.defaultColors[colorIndex],
            icon: 'fa-solid fa-circle-nodes',
        };
    }

    getChannelBgColor(channelName: string): string {
        return this.getChannelStyle(channelName).backgroundColor;
    }

    getChannelIcon(channelName: string): string {
        return this.getChannelStyle(channelName).icon;
    }

    private getDefaultChannelStyle(): StatusStyle {
        return {
            color: colors.white,
            backgroundColor: colors.textMuted,
            icon: 'fa-solid fa-circle-nodes',
        };
    }

    private getDefaultStyle(): StatusStyle {
        return {
            color: colors.white,
            backgroundColor: colors.textMuted,
            icon: 'fa-solid fa-circle',
        };
    }

    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
}
