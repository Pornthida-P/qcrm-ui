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
}

export interface CalendarTag {
    tagId: number;
    tagName: string;
    description?: string;
    createdAt?: Date;
    createdById?: string;
    modifyAt?: Date;
    modifyById?: string;
    isDeleted?: boolean;
}
