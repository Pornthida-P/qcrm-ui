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

    private defaultColors = ['#FB5F20', '#010966', '#006400', '#6c757d', '#17a2b8', '#ffc107', '#dc3545'];

    constructor() {}

    /**
     * Get status style by status name
     */
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

    /**
     * Get status color by index (for status list)
     */
    getStatusColorByIndex(index: number): StatusStyle {
        const colors = ['#FB5F20', '#010966', '#006400'];
        const icons = ['fa-solid fa-folder-open', 'fa-solid fa-hourglass-end', 'fa-solid fa-folder-closed'];

        return {
            color: '#ffffff',
            backgroundColor: colors[index % colors.length],
            icon: icons[index % icons.length],
        };
    }

    /**
     * Get just the background color for badge styling
     */
    getStatusBgColor(statusName: string): string {
        return this.getStatusStyle(statusName).backgroundColor;
    }

    /**
     * Get icon class for status
     */
    getStatusIcon(statusName: string): string {
        return this.getStatusStyle(statusName).icon;
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
