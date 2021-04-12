import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import progressController from '../../../sockets/utils/progressController'
import { BotClientTypes } from '../../index'

class AnimeInfoCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('online', {
      aliases: ['online'],
      category: '🦊 Animes | animes',
      description: {
        content: 'Obter informações sobre nosso site!',
        metadata: 'Informações site',
        usage: '[command]',
        examples: ['[command]'],
      },
    })
  }

  async exec(message: Message) {
    try {
      const progress = progressController.get()

      const embedAnime = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Status do site')
        .addField('\u200B', '\u200B')
        .addField('`Players ativos »`', `\`\`\`yaml\n${progress.size}\`\`\``)
        .addField('\u200B', '\u200B')
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      message.util.reply(embedAnime)
    } catch (error) {
      message.util.reply(
        'Houve um erro ao buscar o status do player de animes.'
      )
    }
  }
}

export default AnimeInfoCommand
