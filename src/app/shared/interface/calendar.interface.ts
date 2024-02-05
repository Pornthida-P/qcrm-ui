import { User } from './user.interface';

export interface CalendarEvent {
    eventId: number;
    title: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string;
    members: User[];
}
