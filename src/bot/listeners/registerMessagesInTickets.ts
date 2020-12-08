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
        if (message.channel.type !== "text")
            return;

        const guildTickets: Object = db.get(`tickets.${message.guild.id}`)
        
        if (guildTickets) {
            const usersTicketsParsed: Array<Array<Ticket>> = Object.values(guildTickets)

            let concatAllTickets: Array<Ticket> = []

            usersTicketsParsed.forEach(userTickets => {
                concatAllTickets.push(...userTickets)
            })
            const ticket: Ticket = concatAllTickets.find((ticket: Ticket) => ticket.channel_id === message.channel.id)
            if (ticket) {
                // @ts-ignore
                ticket.content.push(message)

                let ticketsUserOfAddMessage: Array<Ticket>;
                
                ticketsUserOfAddMessage = concatAllTickets
                    .filter((ticketReplacedPreview: Ticket) => ticket.creator === ticketReplacedPreview.creator)
                    .map((ticketReplaced: Ticket) => (ticketReplaced.id === ticket.id) ? ticket : ticketReplaced)
    
                db.set(`tickets.${message.guild.id}.${ticket.creator}`, ticketsUserOfAddMessage)
            }
        }
    }

}

export default RegisterMessageInTicketsListener
