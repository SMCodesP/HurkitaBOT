import { Command } from "discord-akairo"
import { GuildMember } from "discord.js"
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
                usage: "[command] {@user/userID}",
                examples: [
                    "[command] @SMCodes#4207",
                ]
            },
            args: [
                {
                    id: "member",
                    default: (message: Message): GuildMember => message.guild.members.cache.get(message.author.id),
                    type: async (message: Message, member: GuildMember | string): Promise<GuildMember> => {
                        if (message.mentions.members.first())
                            return message.mentions.members.first()
                        return (typeof member == "string") ? message.guild.members.cache.get(member) : null
                    }
                }
            ]
        })
    }

    async exec(message: Message, { member }: { member: GuildMember }) {
        const userTickets: Array<Ticket> = db.get(`tickets.${message.guild.id}.${member.user.id}`)

        if (userTickets) {
            if (userTickets.filter((ticket) => !ticket.closed).length <= 0)
                return message.util.reply("você não pode deletar um ticket caso não tenha um aberto.")
        }

        if (!message.member.hasPermission("MANAGE_MESSAGES") && member.user.id !== message.author.id)
            return message.util.reply("você não tem permissão para deletar um ticket de outro membro.")

        const ticket = userTickets.find((ticket) => !ticket.closed)

        const ticketsClose = userTickets.map((ticket) => {
            return {
                ...ticket,
                closed: true
            }
        })

        db.set(`tickets.${message.guild.id}.${member.user.id}`, ticketsClose)

        const channel_ticket = message.guild.channels.cache.get(ticket.channel_id)

        await channel_ticket.delete()

        message.util.reply(`você fechou o ticket \`#${ticket.id}\` com sucesso!\nCaso teve algum problema com o ticket ele pode ser reconstruido usando, \`${db.get(`${message.guild.id}.prefix`)}reconstituirticket ${ticket.id}\` assim poderá obter as logs do ticket em um novo canal de ticket.`)
    }

}

export default CloseTicket
