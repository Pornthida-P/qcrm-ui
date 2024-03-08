import { Injectable } from '@angular/core';
import { TranslateService as Translate } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class TranslateService {
    private localStorageKey: string = 'isLanguage';
    private currentLanguage: string = 'th';

    constructor(private translate: Translate) {
        const storedLanguage = localStorage.getItem(this.localStorageKey);
        if (storedLanguage) {
            this.currentLanguage = storedLanguage;
        }
    }

    getCurrentLanguage(): string {
        return this.currentLanguage;
    }

    setCurrentLanguage(lang: string): void {
        this.currentLanguage = lang;
        this.translate.use(lang);
        localStorage.setItem(this.localStorageKey, lang);
    }
}
