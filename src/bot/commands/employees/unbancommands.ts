import { Message } from 'discord.js'
import { Command } from 'discord-akairo'
import validatePermission from '../../../utils/validatePermission'
import { GuildMember } from 'discord.js'
import * as db from 'quick.db'

import getPrefix from '../../../utils/getPrefix'

class UnBanCommands extends Command {
  constructor() {
    super('unbancommands', {
      aliases: ['unbancommands'],
      category: '👷 Funcionários | workers',
      description: {
        content: 'Desbanir um usuário para usar meus comandos!',
        metadata: 'Comando para desbanir nos meus sistemas; desban; unpunish',
        usage: '[command] [@user/userID]',
        examples: ['[command] @SMCodes#4207'],
      },
      args: [
        {
          id: 'memberMention',
          type: async (
            message: Message,
            member: GuildMember | string
          ): Promise<GuildMember> => {
            if (message.mentions.members.first())
              return message.mentions.members.first()
            return typeof member == 'string'
              ? message.guild.members.cache.get(member)
              : null
          },
        },
      ],
    })
  }

  exec(
    message: Message,
    { memberMention }: { memberMention: GuildMember | null }
  ) {
    if (!validatePermission(message.author, 'unbancommands'))
      return message.util.reply(
        'você não tem permissão para desbanir um usuário.'
      )

    if (!memberMention)
      return message.util.reply(
        `sintaxe incorreta, use dessa forma \`${getPrefix(
          message.guild.id
        )}${this.description.usage.replace(/\[command\]/g, this.id)}\``
      )
    if (memberMention.user.id === message.author.id)
      return message.util.reply(`você não pode desbanir a si mesmo.`)

    if (!db.get(`banned.${memberMention.user.id}`))
      return message.util.reply(`o usuário mencionado não está banido.`)

    db.delete(`banned.${memberMention.user.id}`)

    message.util.reply(
      `você desbaniu o usuário \`${memberMention.user.tag}\` com sucesso!`
    )
  }
}

export default UnBanCommands
