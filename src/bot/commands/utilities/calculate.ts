import { Command } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'
import { BotClientTypes } from '../../index'

class CalculateCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('calculate', {
      aliases: ['calculate', 'calc'],
      category: '🛠️ Utilitários | utils',
      description: {
        content: 'Com esse comando você pode calcular uma operação aritmética.',
        metadata: 'Comando para calcular operações aritmética; contas; conta',
        usage: '[command] [Operação aritmética]',
        examples: ['[command] 14 + 2', '[command] 32 * 2'],
      },
      args: [
        {
          id: 'operation',
          type: 'string',
          match: 'content',
        },
      ],
    })
  }

  async exec(message: Message, { operation }: { operation: string }) {
    if (!operation)
      return message.util.reply(
        'Você não digitou uma operação para ser calculada.'
      )

    try {
      const result = eval(operation)

      const embedOperation = new MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(
          message.author.displayAvatarURL({ size: 4096, dynamic: true })
        )
        .setTitle('Resultado da operação:')
        .setDescription(`\`\`\`yaml\n${result}\`\`\``)
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      await message.util.reply(embedOperation)
    } catch (error) {
      const embedOperation = new MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(
          message.author.displayAvatarURL({ size: 4096, dynamic: true })
        )
        .setTitle('Resultado da operação:')
        .setDescription('Operação inválida.')
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      await message.util.reply(embedOperation)
    }
  }
}

export default CalculateCommand
