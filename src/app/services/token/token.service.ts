import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private storageKey = 'tokenData';

    constructor() {}

    private getInitialToken(): string | null {
        const storedData = localStorage.getItem(this.storageKey);
        return storedData ? storedData : null;
    }

    getDataToken(): string | null {
        return this.getInitialToken();
    }

    setDataToken(token: string | null) {
        if (token) {
            localStorage.setItem(this.storageKey, token);
        } else {
            localStorage.removeItem(this.storageKey);
        }
    }
}
