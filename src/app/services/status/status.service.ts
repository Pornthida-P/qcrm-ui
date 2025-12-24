import { Injectable } from '@angular/core';

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
            color: '#ffffff',
            backgroundColor: '#FB5F20',
            icon: 'fa-solid fa-folder-open',
        },
        pending: {
            color: '#ffffff',
            backgroundColor: '#010966',
            icon: 'fa-solid fa-hourglass-end',
        },
        closed: {
            color: '#ffffff',
            backgroundColor: '#006400',
            icon: 'fa-solid fa-folder-closed',
        },
        cancelled: {
            color: '#ffffff',
            backgroundColor: '#6c757d',
            icon: 'fa-solid fa-ban',
        },
    };

    // Channel styles - ช่องทางติดต่อ
    private channelColors: { [key: string]: StatusStyle } = {
        voice: {
            color: '#ffffff',
            backgroundColor: '#17a2b8',
            icon: 'fa-solid fa-phone',
        },
        line: {
            color: '#ffffff',
            backgroundColor: '#06C755',
            icon: 'fa-brands fa-line',
        },
        facebook: {
            color: '#ffffff',
            backgroundColor: '#1877F2',
            icon: 'fa-brands fa-facebook-messenger',
        },
    };

    private defaultColors = ['#FB5F20', '#010966', '#006400', '#6c757d', '#ffc107', '#dc3545'];

    constructor() {}

    getStatusStyle(statusName: string): StatusStyle {
        if (!statusName) {
            return this.getDefaultStyle();
        }

        const normalizedName = statusName.toLowerCase().trim();

        // Check predefined status
        if (this.statusColors[normalizedName]) {
            return this.statusColors[normalizedName];
        }

        // Generate color based on status name hash
        const colorIndex = this.hashString(normalizedName) % this.defaultColors.length;
        return {
            color: '#ffffff',
            backgroundColor: this.defaultColors[colorIndex],
            icon: 'fa-solid fa-circle',
        };
    }

    getStatusColorByIndex(index: number): StatusStyle {
        const colors = ['#FB5F20', '#010966', '#006400'];
        const icons = ['fa-solid fa-folder-open', 'fa-solid fa-hourglass-end', 'fa-solid fa-folder-closed'];

        return {
            color: '#ffffff',
            backgroundColor: colors[index % colors.length],
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

        // Check predefined channels
        if (this.channelColors[normalizedName]) {
            return this.channelColors[normalizedName];
        }

        // Generate color based on channel name hash
        const colorIndex = this.hashString(normalizedName) % this.defaultColors.length;
        return {
            color: '#ffffff',
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
            color: '#ffffff',
            backgroundColor: '#6c757d',
            icon: 'fa-solid fa-circle-nodes',
        };
    }

    private getDefaultStyle(): StatusStyle {
        return {
            color: '#ffffff',
            backgroundColor: '#6c757d',
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
