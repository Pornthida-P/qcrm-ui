import { User } from 'src/app/shared/interface/user.interface';

export type ChatNavKey = 'inbox' | 'history' | 'monitor' | 'broadcast' | 'bot' | 'reports' | 'settings';

function roleTitle(user: User | null | undefined): string {
    return String(user?.role?.roleTitle || '').toLowerCase();
}

/** Admin / system — manage chat config */
export function isChatAdmin(user: User | null | undefined): boolean {
    const title = roleTitle(user);
    return title.includes('admin') || title.includes('system');
}

/** Admin / supervisor / system — monitor & reports */
export function isChatPrivileged(user: User | null | undefined): boolean {
    const title = roleTitle(user);
    return isChatAdmin(user) || title.includes('supervisor');
}

export function canAccessChatNav(key: ChatNavKey, user: User | null | undefined): boolean {
    switch (key) {
        case 'inbox':
        case 'history':
            return true;
        case 'monitor':
        case 'reports':
            return isChatPrivileged(user);
        case 'broadcast':
        case 'bot':
        case 'settings':
            return isChatAdmin(user);
        default:
            return false;
    }
}
