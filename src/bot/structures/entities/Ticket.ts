export interface Ticket {
    id: number;
    channel_id: string;
    creator: string;
    closer: string | null;
    closed: boolean;
    content: Array<Object>;
}