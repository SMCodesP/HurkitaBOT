import { Command } from "discord-akairo"
import { Message } from "discord.js"
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
        const userTickets: Array<string> = db.get(`tickets.${message.author.id}`)

        if (userTickets) {
            const userTicketsParsedOfItems: Array<Ticket> = userTickets.map((ticket: string) => JSON.parse(ticket))

            if (userTicketsParsedOfItems.filter((ticket) => ticket.closed).length > 0)
                return message.reply("você não pode deletar um ticket caso você não tenha um aberto.")
        }

        
    }

}

export default CloseTicket
