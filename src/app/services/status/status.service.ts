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
            backgroundColor: colors.primary,
            icon: 'fa-solid fa-folder-open',
        },
        pending: {
            color: colors.white,
            backgroundColor: colors.blueDark,
            icon: 'fa-solid fa-hourglass-end',
        },
        closed: {
            color: colors.white,
            backgroundColor: colors.successDark,
            icon: 'fa-solid fa-folder-closed',
        },
        cancelled: {
            color: colors.white,
            backgroundColor: colors.textMuted,
            icon: 'fa-solid fa-ban',
        },
    };

    private channelColors: { [key: string]: StatusStyle } = {
        voice: {
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
    };

    private defaultColors = [...statusPalette];

    constructor() {}

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
        const palette = [colors.primary, colors.blueDark, colors.successDark];
        const icons = ['fa-solid fa-folder-open', 'fa-solid fa-hourglass-end', 'fa-solid fa-folder-closed'];

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

        const normalizedName = channelName.toLowerCase().trim();

        if (this.channelColors[normalizedName]) {
            return this.channelColors[normalizedName];
        }

        const colorIndex = this.hashString(normalizedName) % this.defaultColors.length;
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
