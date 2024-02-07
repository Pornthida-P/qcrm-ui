export interface Attachment {
    attachmentId: string;
    caseId: string;
    filename: string;
    filepath: string;
    fileType?: string | null;
    fileSize?: number | null;
    createdAt?: Date | null;
    createdById?: string | null;
    modifiedAt?: Date | null;
    modifiedById?: string | null;
    isDeleted?: boolean | null;
}
