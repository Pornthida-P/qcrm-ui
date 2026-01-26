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

    clearDataToken() {
        localStorage.removeItem(this.storageKey);
    }

    isTokenExpired(bufferMinutes: number = 0): boolean {
        const token = this.getDataToken();
        if (!token) {
            return true;
        }

        try {
            const payload = this.decodeToken(token);
            if (!payload || !payload.exp) {
                return true;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const bufferSeconds = bufferMinutes * 60;
            // ถ้า token หมดอายุแล้ว หรือเหลือเวลาไม่ถึง buffer time
            return payload.exp < (currentTime + bufferSeconds);
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    }

    decodeToken(token: string): any {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }

            const payload = parts[1];
            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decoded);
        } catch (error) {
            return null;
        }
    }

    isTokenValid(): boolean {
        const token = this.getDataToken();
        return !!token && !this.isTokenExpired(0);
    }
}
