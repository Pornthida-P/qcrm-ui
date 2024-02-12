import { User } from './user.interface';

export interface Group {
    groupId: string;
    groupTitle: string;
    description: string;
    members: User[];
    createdAt: string;
    createdById: string;
    modifiedAt: string;
    modifiedById: string;
    isDeleted: number;
}
