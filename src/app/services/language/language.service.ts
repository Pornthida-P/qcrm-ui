import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private readonly STORAGE_KEY = 'lang';

    constructor(private translate: TranslateService) {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        const fallback = 'th';
        const initial = saved || fallback;

        translate.addLangs(['th', 'en']);
        translate.setDefaultLang(fallback);
        translate.use(initial);
    }

    current(): string {
        return this.translate.currentLang || this.translate.getDefaultLang();
    }

    toggle(): string {
        const next = this.current() === 'th' ? 'en' : 'th';
        this.translate.use(next);
        localStorage.setItem(this.STORAGE_KEY, next);
        return next;
    }
}
