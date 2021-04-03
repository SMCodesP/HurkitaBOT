import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { BotClientTypes } from '../../'
import getPrefix from '../../../utils/getPrefix'

class Mp3Stop extends Command {
  client: BotClientTypes

  constructor() {
    super('mp3stop', {
      aliases: ['mp3stop', 'mp3parar'],
      channel: 'guild',
      category: '📻 Mp3 rádio | mp3',
      description: {
        content: 'Com esse comando você pode parar a música mp3!',
        metadata: 'Mp3 stop; parar;',
        usage: '[command]',
        examples: ['[command]'],
      },
    })
  }

  exec(message: Message) {
    if (!message.member.voice.channel)
      return message.util.reply('você não está em um canal de voz!')

    const serverQueue = this.client.queueSongs.get(message.guild.id)

    if (!serverQueue)
      return message.util.reply(
        `não estou com tocando nenhuma música, então não posso parar.`
      )

    serverQueue.voiceChannel.leave()
    this.client.queueSongs.delete(message.guild.id)

    message.util.reply(`todas as músicas foram retiradas da fila!`)
  }
}

export default Mp3Stop
