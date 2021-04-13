import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import ping from 'node-http-ping'
import fetch from 'node-fetch'

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
      const time = await ping(process.env.FRONTEND)
      const response = await fetch(
        'https://appanimeplus.tk/api-animesbr-10.php'
      )
      const animes = await response.json()

      const animesAvailable = animes.filter(
        (item) => !item.category_name.toLowerCase().includes('animetv')
      )

      const embedAnime = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('ℹ️ __Status do site__')
        .setDescription('**Informações disponíveis sobre nosso site.**')
        .addField(
          '\n> `Espectadores ativos »`',
          `\`\`\`yaml\n${progress.size}\`\`\``,
          true
        )
        .addField('> `Ping »`', `\`\`\`yaml\n${time}\`\`\`\n`, true)
        .addField(
          '> `Animes disponíveis »`',
          `\`\`\`yaml\n${animesAvailable.length}\`\`\`\n`,
          false
        )
        .addField(
          '\u200B',
          '**Assista já seus animes em: https://example.com**'
        )
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      message.util.reply(embedAnime)
    } catch (error) {
      console.error(error)
      message.util.reply(
        'Houve um erro ao buscar o status do player de animes.'
      )
    }
  }
}

export default AnimeInfoCommand
