import { Command } from "discord-akairo"
import { GuildChannel, Message } from "discord.js"
import * as db from "quick.db"
import { Ticket } from "../../structures/entities/Ticket"

class CloseTicket extends Command {

    constructor() {
        super("closeticket", {
            aliases: ["fecharticket", "closeticket", "deletarticket"],
            category: "🎟️ Tickets | tickets",
            channel: "guild",
            description: {
                content: "Feche um ticket caso seu problema já foi resolvido!",
                metadata: "Comando para deletar tickets; delete; fechar; close; fechar ticket; close ticket; delete ticket;",
                usage: "[command]",
                examples: [
                    "[command]",
                ]
            }
        })
    }

    async exec(message: Message) {
        const userTickets: Array<Ticket> = db.get(`tickets.${message.guild.id}.${message.author.id}`)

        if (userTickets) {
            if (userTickets.filter((ticket) => !ticket.closed).length <= 0)
                return message.reply("você não pode deletar um ticket caso você não tenha um aberto.")
        }

        const ticket = userTickets.find((ticket) => !ticket.closed)

        const ticketsClose = userTickets.map((ticket) => {
            return {
                ...ticket,
                closed: true
            }
        })

        db.set(`tickets.${message.guild.id}.${message.author.id}`, ticketsClose)

        const channel_ticket = message.guild.channels.cache.get(ticket.channel_id)

        await channel_ticket.delete()

        message.reply(`você fechou o ticket \`#${ticket.id}\` com sucesso!`)
    }

}

export default CloseTicket
