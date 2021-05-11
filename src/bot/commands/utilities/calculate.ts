import { Message, MessageEmbed } from 'discord.js'
import { Command } from 'discord-akairo'
import formatNumber from '../../../utils/formatNumber'
import revertFormatNumber from '../../../utils/revertFormatNumber'

class CalculateCommand extends Command {
  constructor() {
    super('calculate', {
      aliases: ['calculate', 'calc', 'calcular'],
      description: {
        content: 'Calcular números longos e abreviados.',
        usage: '[command] [Operação aritmética]',
        examples: ['[command] 7 * 6', '[command] 25K + 10K'],
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
    const expressions = ['-', '+', '*', '/', '%']

    let args = operation
      .split(' ')
      .join('&split;')
      .split('-')
      .join('&split;-&split;')
      .split('+')
      .join('&split;+&split;')
      .split('/')
      .join('&split;/&split;')
      .split('*')
      .join('&split;*&split;')
      .split('%')
      .join('&split;%&split;')
      .split('&split;')
      .filter((arg) => arg.length !== 0)
    const regex = new RegExp(/[.]+/g)

    try {
      const numbersCalc = args.map((arg) => {
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(Number(arg.replace(regex, '')))) return Number(arg)
        if (!expressions.includes(arg)) {
          const number = revertFormatNumber(arg)
          if (typeof number === 'number') return number
          return null
        }
        return arg
      })

      // eslint-disable-next-line no-eval
      const calc = eval(numbersCalc.join(' '))
      const embedOperation = new MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(
          message.author.displayAvatarURL({ size: 4096, dynamic: true })
        )
        .setTitle('Resultado da operação:')
        .setDescription(`\`\`\`yaml\n${formatNumber(calc)}\`\`\``)
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      await message.channel.send(embedOperation)

      return
    } catch (error) {
      console.error(error)
      await message.channel.send(`${message.author}, operação inválida.`)
      return
    }
  }
}

export default CalculateCommand
