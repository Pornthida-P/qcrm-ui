export interface Announce {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    createAt: string;
    createById: string;
}

export interface AnnounceCard {
    id: string;
    title: string;
    type: string;
    description: string;
    attachment: Attachment[];
    startDate: string;
    endDate: string;
    createAt: string;
    createById: string;
}

interface Attachment {
    id: number;
    fileType: string;
    fileUrl: string;
    fileName: string;
    createDate: string;
    createById: string;
}
