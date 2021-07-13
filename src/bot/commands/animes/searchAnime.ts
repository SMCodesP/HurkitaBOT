import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import ping from 'node-http-ping'
import axios from 'axios'

import progressController from '../../../sockets/utils/progressController'
import { BotClientTypes } from '../../index'

class SearchAnimeCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('searchanime', {
      aliases: [
        'sanime',
        'procuraranime',
        'panime',
        'localizaranime',
        'lanime',
      ],
      category: '🦊 Animes | animes',
      description: {
        content: 'Buscar anime por GIF/Imagem!',
        metadata: 'Procurar animes',
        usage: '[command] [Anexar arquivo/Link do GIF/Imagem]',
        examples: [
          '[command] https://media.tenor.co/videos/b72090d0cf0a2e2f602d06530852881f/mp4',
        ],
      },
      args: [
        {
          id: 'query',
          type: 'string',
        },
      ],
    })
  }

  async exec(message: Message, { query }) {
    try {
      const urlSearch = message.attachments.first()
        ? message.attachments.first().url
        : query

      const embedAnimeLoading = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Procurando...')
        .setTimestamp()
        .setFooter(
          `Copyright © 2021 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      await message.util.reply(embedAnimeLoading)

      const {
        data: {
          result: [trace],
        },
      } = await axios.get('https://api.trace.moe/search?anilistInfo', {
        params: {
          url: urlSearch,
        },
      })

      let embedTemplate = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Resultado da pesquisa')
        .addField(
          'Título »',
          `\`\`\`diff\n- ${trace.anilist.title.romaji}\`\`\``,
          false
        )
        .addField(
          'Título (JP) »',
          `\`\`\`yaml\n${trace.anilist.title.native}\`\`\``,
          true
        )
        .addField(
          'Título (EN) »',
          `\`\`\`yaml\n${trace.anilist.title.english}\`\`\``,
          true
        )
        .addField('Episódio »', `\`\`\`yaml\n${trace.episode}\`\`\``, false)
        .addField(
          'Tempo »',
          `\`\`\`yaml\n${this.toHHMMSS(trace.from)} à ${this.toHHMMSS(
            trace.to
          )}\`\`\``,
          false
        )
        .setImage(trace.image)
        .setTimestamp()
        .setFooter(
          `Copyright © 2021 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      message.util.reply(embedTemplate)
      message.channel.send({
        files: [trace.video],
      })
    } catch (error) {
      console.error(error)
      message.util.reply('Houve um erro ao buscar o anime da GIF/Imagem.')
    }
  }

  toHHMMSS(secs: any) {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':')
  }
}

export default SearchAnimeCommand
