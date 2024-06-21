import { Attachment } from './attachment.interface';
import { User } from './user.interface';

export interface CalendarEvent {
    eventId: number;
    title: string;
    tag: CalendarTag;
    location?: string;
    startDate: string;
    endDate: string;
    description: string;
    members: User[];
    attachments: Attachment[];
    createdAt: string;
    createdById: string;
    modifyAt: string;
    modifyById: string;
    username : string;
}

export interface CalendarTag {
    tagId: number;
    tagName: string;
    description?: string;
    color?: string;
    createdAt?: string;
    createdById?: string;
    modifyAt?: string;
    modifyById?: string;
    isDeleted?: boolean;
}
