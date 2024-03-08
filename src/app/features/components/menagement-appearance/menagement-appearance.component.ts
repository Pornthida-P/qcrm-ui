import { Component, OnInit } from '@angular/core';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
    selector: 'app-menagement-appearance',
    templateUrl: './menagement-appearance.component.html',
    styleUrl: './menagement-appearance.component.scss',
})
export class MenagementAppearanceComponent implements OnInit {
    title: string = 'menagement-appearance';
    colorPairs = [
        { color1: '#3066be', color2: '#60afff' },
        { color1: '#d94855', color2: '#ec5365' },
        { color1: '#48d357', color2: '#53ec62' },
        { color1: '#6a3bcc', color2: '#8c4bff' },
        { color1: '#ccac00', color2: '#ffd700' },
        { color1: '#cc8800', color2: '#ffaa33' },
        { color1: '#004d4d', color2: '#008080' },
    ];

    constructor(private themeService: ThemeService, private auditLogService: AuditLogService) {}

    ngOnInit(): void {}

    getLinearGradient(color1: string, color2: string): string {
        return `linear-gradient(-45deg, ${color1} 0%, ${color1} 50%, ${color2} 50%, ${color2} 100%)`;
    }

    changeTheme(primaryColor: string, secondaryColor: string): void {
        this.themeService.setThemeVariables(primaryColor, secondaryColor);
        this.auditLogService.log('', 'Setting', 'Change Theme', `Theme : ${primaryColor}, ${secondaryColor}`, `Success`);
    }
}
