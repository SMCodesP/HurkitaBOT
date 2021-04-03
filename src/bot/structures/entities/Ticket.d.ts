import { MessageAttachment, MessageEmbed } from 'discord.js'

export interface Ticket {
  id: number
  channel_id: string
  guild_id: string
  creator: string
  closer: string | null
  closed: boolean
  content: Array<{
    channelID: string
    deleted: boolean
    id: string
    type: string
    system: boolean
    content: string
    authorID: string
    pinned: boolean
    tts: boolean
    nonce: string
    embeds: Array<MessageEmbed>
    attachments: Array<MessageAttachment>
    createdTimestamp: Number
    editedTimestamp: Number
    webhookID: string | null
    applicationID: string | null
    activity: string | null
    flags: Number
    reference: string | null
    guildID: string
    cleanContent: string
  }>
}
