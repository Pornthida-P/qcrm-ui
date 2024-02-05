import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private rootElement = document.documentElement;
    private storageKey = 'appTheme';

    setThemeVariables(primaryColor: string, primaryActiveColor: string) {
        this.rootElement.style.setProperty('--primary', primaryColor);
        this.rootElement.style.setProperty('--primary-active-color', primaryActiveColor);

        const themeData = { primaryColor, primaryActiveColor };
        localStorage.setItem(this.storageKey, JSON.stringify(themeData));
    }

    getSavedTheme(): { primaryColor: string; primaryActiveColor: string } | null {
        const themeDataString = localStorage.getItem(this.storageKey);
        if (themeDataString) {
            return JSON.parse(themeDataString);
        }
        return null;
    }
}
