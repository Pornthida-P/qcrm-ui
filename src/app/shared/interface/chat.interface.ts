export interface ChatConversation {
    id?: number;
    chatRoomId: string;
    externalUserId?: string;
    displayName?: string;
    pictureUrl?: string;
    channelKey?: string;
    channelType?: string;
    channelName?: string;
    status?: 'queue' | 'assigned' | 'ended' | string;
    agentUserId?: string;
    agentUsername?: string;
    assignByUserId?: string;
    assignByDisplayName?: string;
    lastMessage?: string;
    lastMessageType?: string;
    lastMessageTime?: number;
    unread?: number;
    startWaitTime?: number;
    assignTime?: number;
    startTime?: number;
    endTime?: number;
    phoneNumber?: string;
    issue?: string;
    contactType?: string;
    contactId?: string;
}

export interface ChatMessage {
    id?: number;
    messageId?: string;
    chatRoomId: string;
    sender?: any;
    receiver?: any;
    senderName?: string;
    receiverName?: string;
    secretType?: string;
    channelKey?: string;
    channelType?: string;
    channelName?: string;
    direction?: 'in' | 'out' | string;
    messageType?: string;
    messageText?: string;
    messageData?: any;
    timestamp?: number;
    readStatus?: number;
}
