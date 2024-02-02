import { User } from './user.interface';

export interface CalendarEvent {
    eventId: number;
    title: string;
    location?: string;
    datetime: string;
    description: string;
    members: User[];
}
