import { User } from './user.interface';

export interface Notification {
    notificationId: number;
    title: string;
    message: string;
    isRead: boolean;
    user: User;
    createdAt: string;
    createdById: string;
    modifyAt: string;
    modifiedById: string;
}
