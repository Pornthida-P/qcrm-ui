import { User } from './user.interface';

export interface CalendarEvent {
    title: string;
    location: string;
    datetime: string;
    description: string;
    members: User[];
}
