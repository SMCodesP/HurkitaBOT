import { Command } from 'discord-akairo'
import { BotClientTypes } from '../../index'
import { Message, OverwriteResolvable } from 'discord.js'
import * as db from 'quick.db'
import { Ticket } from '../../structures/entities/Ticket'

class NewTicketCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('newticket', {
      aliases: ['criarticket', 'newticket', 'createticket'],
      category: '🎟️ Tickets | tickets',
      channel: 'guild',
      description: {
        content: 'Crie tickets para tirar suas dúvidas!',
        metadata: 'Comando para criar tickets; ticket; ajuda;',
        usage: '[command]',
        examples: ['[command]'],
      },
    })
  }

  async exec(message: Message) {
    const ticketsAll: Array<Array<Ticket>> = Object.values(
      db.get(`tickets.${message.guild.id}`) || {}
    )
    const userTickets: Array<Ticket> = db.get(
      `tickets.${message.guild.id}.${message.author.id}`
    )

    if (userTickets) {
      if (
        userTickets.filter((ticket) => {
          return !ticket.closed
        }).length > 0
      )
        return message.reply('você não pode criar um ticket com outro aberto.')
    }

    const positions = await message.guild.members.fetch()
    const positionsFormatted: Array<OverwriteResolvable> = positions
      .filter((member) => member.hasPermission('MANAGE_MESSAGES'))
      .map((member) => {
        return {
          id: member.user.id,
          allow: ['VIEW_CHANNEL'],
        }
      })

    const ticket_id: number =
      ticketsAll.reduce(
        (accumulator, currentValue) => accumulator + currentValue.length,
        0
      ) + 1

    const channelOfTicket = await message.guild.channels.create(
      `ticket-${ticket_id}`,
      {
        permissionOverwrites: [
          ...positionsFormatted,
          {
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: message.author.id,
            allow: ['VIEW_CHANNEL'],
          },
        ],
      }
    )

    const ticket: Ticket = {
      id: ticket_id,
      channel_id: channelOfTicket.id,
      guild_id: message.guild.id,
      creator: message.author.id,
      closer: null,
      closed: false,
      content: [],
    }

    db.push(`tickets.${message.guild.id}.${message.author.id}`, ticket)

    message.reply(
      `Seu ticket foi criado com sucesso.\nClique aqui para acessar ${channelOfTicket}`
    )
  }
}

export default NewTicketCommand
