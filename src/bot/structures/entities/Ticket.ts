import { Message } from "discord.js"

export interface Ticket {
    creator: string,
    closer: string | null,
    closed: boolean,
    content: Array<Message>,
}