import { Message } from 'discord.js';
import { Listener } from "discord-akairo";
import * as db from "quick.db";
import { Ticket } from '../structures/entities/Ticket';

class RegisterMessageInTicketsListener extends Listener {

    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
        })
    }

    exec(message: Message) {
        const guildTickets: Object = db.get(`tickets.${message.guild.id}`)
        const usersTicketsParsed: Array<Array<Ticket>> = Object.values(guildTickets)

        if (guildTickets) {
            let concatAllTickets: Array<Ticket> = []

            usersTicketsParsed.forEach(userTickets => {
                concatAllTickets = [...concatAllTickets, ...userTickets]
            })

            const ticket: Ticket = concatAllTickets.find((ticket: Ticket) => ticket.channel_id === message.channel.id)
            if (ticket) {
                ticket.content.push(message.toJSON())
            }
            let ticketsUserOfAddMessage: Array<Ticket>;
            
            ticketsUserOfAddMessage = concatAllTickets
                .filter((ticketReplacedPreview: Ticket) => ticket.creator === ticketReplacedPreview.creator)
                .map((ticketReplaced: Ticket) => (ticketReplaced.id === ticket.id) ? ticket : ticketReplaced)

            db.set(`tickets.${message.guild.id}.${message.author.id}`, ticketsUserOfAddMessage)
        }
    }

}

export default RegisterMessageInTicketsListener
