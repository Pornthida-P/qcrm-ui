import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'qcrm-ui';

    constructor(private themeService: ThemeService) {}

    ngOnInit() {
        this.setTheme();
    }

    setTheme() {
        const savedTheme = this.themeService.getSavedTheme();
        if (savedTheme) {
            this.themeService.setThemeVariables(savedTheme.primaryColor, savedTheme.primaryActiveColor);
        }
    }
}
