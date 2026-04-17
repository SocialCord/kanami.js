export interface Interaction {
    id: string;
    type: 2 | 3; // 2 - button, 3 - select menu
    customId: string;
    values?: string[];
    user: {
        id: string;
        username: string;
    };
    guildId?: string;
    channelId: string;
    messageId: string;
    component: any;
    
    reply: (content: string | any, options?: any) => Promise<any>;
    update: (content: string | any, options?: any) => Promise<any>;
    deferReply: (ephemeral?: boolean) => Promise<void>;
    deferUpdate: () => Promise<void>;
}

export interface InteractionCollectorOptions {
    time?: number;
}

export interface InteractionCollector {
    on: (event: 'collect' | 'end', callback: (data: any) => void) => void;
    off: (event: 'collect' | 'end', callback: (data: any) => void) => void;
    stop: () => void;
}