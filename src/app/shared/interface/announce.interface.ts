export interface Announce {
    announceId: string;
    announceTitle: string;
    description: string | null;
    startDate: string;
    endDate: string;
    createdAt: string | null;
    createdById: string | null;
    modifiedAt: string | null;
    modifiedById: string | null;
    isDeleted: number;
}
