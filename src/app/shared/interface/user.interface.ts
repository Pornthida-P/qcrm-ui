import { Role } from './role.interface';

export interface User {
    userId: string;
    username: string;
    email: string;
    profile: string;
    role: Role;
    lastLogin?: string;
    isActive?: number;
    channelKeys?: string[];
}
