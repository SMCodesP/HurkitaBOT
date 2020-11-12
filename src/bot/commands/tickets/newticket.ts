import { Command } from "discord-akairo"
import { BotClientTypes } from "../../index"
import { Message, OverwriteResolvable } from "discord.js"
import * as db from "quick.db"
import { Ticket } from "../../structures/entities/Ticket";

class NewTicketCommand extends Command {
    client: BotClientTypes;

    constructor() {
        super("newticket", {
            aliases: ["criarticket", "newticket", "createticket"],
            category: "🎟️ Tickets | tickets",
            channel: "guild",
            description: {
                content: "Crie tickets para tirar suas dúvidas!",
                metadata: "Comando para criar tickets; ticket; ajuda;",
                usage: "[command]",
                examples: [
                    "[command]",
                ]
            }
        })
    }

    async exec(message: Message) {
        const userTickets: Array<string> = db.get(`tickets.${message.author.id}`)

        if (userTickets) {
            const userTicketsParsedOfItems: Array<Ticket> = userTickets.map((ticket: string) => {
                return JSON.parse(ticket)
            })

            if (userTicketsParsedOfItems.filter((ticket) => {
                return !ticket.closed
            }).length > 0)
                return message.reply("você não pode criar um ticket com outro aberto.")
        }

        const positions: Array<OverwriteResolvable> = message.guild.members.cache.map((user) => {
            if (!user.hasPermission("MANAGE_MESSAGES"))
                return null;
            return {
                id: user.user.id,
                allow: ["VIEW_CHANNEL"],
            }
        })

        const channelOfTicket = await message.guild.channels.create("ticket-360247173356584960", {
            permissionOverwrites: [
                ...positions,
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

        const ticket: Ticket = {
            creator: message.author.id,
            closer: null,
            closed: false,
            content: [],
        }

        db.push(`tickets.${message.author.id}`, JSON.stringify(ticket))

        message
            .reply(`Seu ticket foi criado com sucesso.\nClique aqui para acessar ${channelOfTicket}`)
            .then((messageOfAlertSuccess: Message) => {
                messageOfAlertSuccess.delete({ timeout: 2500 })
            })

    }

}

export default NewTicketCommand