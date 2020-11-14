import { Message, MessageEmbed, TextChannel, OverwriteResolvable } from "discord.js"
import { Command } from "discord-akairo"
import * as db from "quick.db"
import { Ticket } from "../../structures/entities/Ticket"
import { GuildMember } from "discord.js"

class ReplenishTicket extends Command {

    constructor() {
        super("replenishticket", {
            aliases: ["replenishticket", "reconstituirticket"],
            category: "🎟️ Tickets | tickets",
            channel: "guild",
            description: {
                content: "Reconstrua um ticket específico!",
                metadata: "Reconstriuir ticket; replenish; reconstituir",
                usage: "[command] [Ticket id]",
                examples: [
                    "[command] 5",
                ]
            },
            args: [
                {
                    id: "ticket_id",
                    type: "number"
                },
            ]
        })
    }

    async exec(message: Message, { ticket_id }: { ticket_id: Number }) {

        if (!ticket_id)
            return message.reply("Por favor execute o comando novamente com o id do ticket, ele é obrigatório.")

        const guildTickets: Object = db.get(`tickets.${message.guild.id}`)
        
        if (guildTickets) {
            const usersTicketsParsed: Array<Array<Ticket>> = Object.values(guildTickets)

            let concatAllTickets: Array<Ticket> = []

            usersTicketsParsed.forEach(userTickets => {
                concatAllTickets = [...concatAllTickets, ...userTickets]
            })

            const ticket = concatAllTickets.find((ticket: Ticket) => (ticket.id === ticket_id && ticket.closed))

            if (!ticket)
                return message.channel.send("Não existe ou o ticket com esse id não está fechado.")

            const creator = await message.guild.members.fetch(ticket.creator)

            if (!message.member.hasPermission("MANAGE_MESSAGES") && creator.user.id !== message.author.id)
                return message.reply("você não tem permissão para reconstituir um ticket de outro membro.")

            if (!creator)
                return message.channel.send("O criador do ticket não existe nesse servidor.")

            const embedReconstitutingTicket = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("👷 Reconstituindo...")
                .setDescription("📄 Pode demorar um tempo para terminar a reconstituição.")
                .addField(
                    "🔧 Criador do ticket »",
                    `\`\`\`yaml\n${creator.user.tag}\`\`\``,
                    true
                )
                .addField(
                    "📖 Mensagens trocadas »",
                    `\`\`\`yaml\n${ticket.content.length}\`\`\``,
                    true
                )
                .addField(
                    "💬 Nome do canal de ticket »",
                    `\`\`\`yaml\nticket-${ticket.id}\`\`\``
                )
                .setTimestamp()
                .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())

            const messageReconstituing = await message.reply(embedReconstitutingTicket)

            let categoryChannel = message.guild.channels.cache.find((channelCache) => (channelCache.name === "Reconstituições" && channelCache.type === "category"))
            let reconstitutedChannel: TextChannel;

            const positions = await message.guild.members.fetch()
            const positionsFormatted: Array<OverwriteResolvable> = positions.filter((member) => member.hasPermission("MANAGE_MESSAGES")).map((member) => {
                return {
                    id: member.user.id,
                    allow: ["VIEW_CHANNEL"],
                }
            })

            if (categoryChannel) {
                reconstitutedChannel = await message.guild.channels.create(`ticket-${ticket.id}`, {
                    type: "text",
                    parent: categoryChannel,
                    permissionOverwrites: [
                        ...positionsFormatted,
                        {
                            id: message.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        },
                        {
                            id: message.author.id,
                            allow: ["VIEW_CHANNEL"]
                        }
                    ]
                })
            } else {
                categoryChannel = await message.guild.channels.create(`Reconstituições`, {
                    type: "category",
                })
                reconstitutedChannel = await message.guild.channels.create(`ticket-${ticket.id}`, {
                    type: "text",
                    parent: categoryChannel,
                    permissionOverwrites: [
                        ...positionsFormatted,
                        {
                            id: message.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        },
                        {
                            id: ticket.creator,
                            allow: ["VIEW_CHANNEL"]
                        }
                    ]
                })
            }

            const webhooks = {}

            const createWebhooksPromise = ticket.content.map(async (ticketMessage) => {
                const member = await message.guild.members.fetch(ticketMessage.authorID)

                if(!webhooks[member.user.id]) {
                    webhooks[member.user.id] = await reconstitutedChannel.createWebhook(member.user.username, {
                        avatar: member.user.avatarURL(),
                    })
                }
            })

            await Promise.all(createWebhooksPromise)

            const sendMessagesOfTicket = ticket.content.map((messageTicket) => {
                return webhooks[messageTicket.authorID].send(messageTicket.content)
            })

            await Promise.all(sendMessagesOfTicket)
            
            const embedReconstitutedTicket = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("👷 Reconstituído")
                .addField(
                    "🔧 Criador do ticket »",
                    `\`\`\`yaml\n${creator.user.tag}\`\`\``,
                    true
                )
                .addField(
                    "📖 Mensagens trocadas »",
                    `\`\`\`yaml\n${ticket.content.length}\`\`\``,
                    true
                )
                .addField(
                    "💬 Nome do canal de ticket »",
                    `\`\`\`yaml\nticket-${ticket.id}\`\`\``
                )
                .setTimestamp()
                .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())

            await messageReconstituing.edit(embedReconstitutedTicket)
        } else {
            message.reply("não tem houve nenhum ticket criado nesse servidor.")
        }
    }

}

export default ReplenishTicket
