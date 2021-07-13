import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import * as translatte from 'translatte'
import { BotClientTypes } from '../../index'
import axios from 'axios'

class AnimeInfoCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('animecitacao', {
      aliases: ['animecitacao', 'acitacao', 'animequote', 'aquote'],
      category: '🦊 Animes | animes',
      description: {
        content: 'Gerar uma citação de um personagem.',
        metadata: 'Gerador',
        usage: '[command]',
        examples: ['[command]'],
      },
    })
  }

  async exec(message: Message) {
    const embedAnimeLoading = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Gerando...')
      .setTimestamp()
      .setFooter(
        `Copyright © 2021 - ${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )

    await message.util.reply(embedAnimeLoading)

    try {
      const { data: animechan } = await axios.get('https://animechan.vercel.app/api/random')

      const query = `
      query ($search: String) {
        Page(page: 1, perPage: 1) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }

          characters(search: $search) {
            image {
              large
            }
          }
        }
      }
      `
      const variables = {
        search: animechan.character
      }
      const { data: {data: {Page: {characters: [character]}}} } = await axios.post(`https://graphql.anilist.co`, {
        query,
        variables,
      })

      const quote = await translatte(
        animechan.quote.substring(0, 1000),
        {
          to: 'pt',
        }
      )

      let embedAnime = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('**Citação**')
        .setDescription(
          `Fonte **[AnimeChan](https://animechan.vercel.app)**.\n\u200B`
        )
        .addField('Personagem »', `\`\`\`diff\n- ${animechan.character}\`\`\``, true)
        .addField(
          'Anime »',
          `\`\`\`diff\n- ${animechan.anime}\`\`\``,
          true
        )
        .addField('Citaçao (Original) »', `\`\`\`yaml\n${animechan.quote}\`\`\``, false)
        .addField(
          'Citação (Traduzida) »',
          `\`\`\`yaml\n${quote.text}\`\`\``,
          false
        )
        .setTimestamp()
        .setFooter(
          `Copyright © 2021 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      if (character) {
        embedAnime = embedAnime.setImage(character.image.large)
      }

      message.util.reply(embedAnime)
    } catch (error) {
      console.log(error)
      message.util.reply(
        'Houve um erro ao buscar o anime, tente novamente mais tarde.'
      )
    }
  }
}

export default AnimeInfoCommand
