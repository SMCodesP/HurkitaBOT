import { Message } from 'discord.js'
import { Command } from 'discord-akairo'
import { BotClientTypes } from '../../'
import getPrefix from '../../../utils/getPrefix'

class Mp3Pause extends Command {
  client: BotClientTypes

  constructor() {
    super('mp3pause', {
      aliases: ['mp3pausar', 'mp3pause'],
      category: '📻 Mp3 rádio | mp3',
      channel: 'guild',
      description: {
        content: 'Com ele você pode pausar uma música mp3!',
        metadata: 'Mp3 pause; pausar; stop;',
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
        `não estou com tocando nenhuma música, então não posso pausar.`
      )

    if (serverQueue.connection.dispatcher.paused)
      return `a fila já está pausada, use \`${getPrefix(
        message.guild.id
      )}mp3retomar\` para retormar a tocar as músicas.`

    serverQueue.connection.dispatcher.pause()

    message.util.reply(
      `a fila foi pausada com sucesso!\nUse \`${getPrefix(
        message.guild.id
      )}mp3retomar\` para retormar a tocar as músicas.`
    )
  }
}

export default Mp3Pause
