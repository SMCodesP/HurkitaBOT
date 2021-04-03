import { Message } from 'discord.js'
import { Command } from 'discord-akairo'
import { BotClientTypes } from '../../'
import getPrefix from '../../../utils/getPrefix'

class Mp3Resume extends Command {
  client: BotClientTypes

  constructor() {
    super('mp3resume', {
      aliases: ['mp3retomar', 'mp3resume'],
      category: '📻 Mp3 rádio | mp3',
      channel: 'guild',
      description: {
        content: 'Você pode retornar em uma música quando pausada!',
        metadata: 'Mp3 resume; retomar; retornar;',
        usage: '[command]',
        examples: ['[command]'],
      },
    })
  }

  async exec(message: Message) {
    if (!message.member.voice.channel)
      return message.util.reply('você não está em um canal de voz!')

    const serverQueue = this.client.queueSongs.get(message.guild.id)

    if (!serverQueue)
      return message.util.reply(
        `não estou com tocando nenhuma música, então não posso retomar.`
      )

    if (!serverQueue.connection.dispatcher.paused)
      return `a fila não está pausada, use \`${getPrefix(
        message.guild.id
      )}mp3pausar\` para pausar a fila.`

    serverQueue.connection.dispatcher.resume()

    message.util.reply(
      `a fila foi foi retomada com sucesso!\nUse \`${getPrefix(
        message.guild.id
      )}mp3pausar\` para pausar a fila novamente.`
    )
  }
}

export default Mp3Resume
