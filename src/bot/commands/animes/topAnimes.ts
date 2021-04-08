import { Command } from 'discord-akairo'
import { CollectorFilter, MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'
import { BotClientTypes } from '../../index'
import * as db from 'quick.db'
import JikanTS from 'jikants'

type typeOfTypes = 'airing' | 'upcoming' | 'tv' | 'movie' | 'ova' | 'special'

const types: {
  [type: string]: typeOfTypes
} = {
  lancamento: 'airing',
  upcoming: 'upcoming',
  tv: 'tv',
  filme: 'movie',
  ova: 'ova',
  especiais: 'special',
}

class TopAnimesCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('topanimes', {
      aliases: ['topanimes'],
      category: '🦊 Animes | animes',
      description: {
        content: 'Com esse comando você listar o top de animes.',
        metadata: 'Comando para top anime;',
        usage: '[command] {tipo/lista} {page}',
        examples: ['[command]', '[command] lista'],
      },
      args: [
        {
          id: 'type',
          type: 'string',
        },
        {
          id: 'page',
          type: 'number',
          default: 1,
        },
      ],
    })
  }

  async exec(
    message: Message,
    { type, page }: { type: string | undefined; page: number }
  ) {
    const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX
    const typeAnimeSelected: typeOfTypes = types[type]

    if (type === 'list') {
      const embedTypes = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle("Lista de top's de animes")
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      Object.keys(types).forEach((typeAnime) => {
        embedTypes.addField(
          `> ${typeAnime}`,
          `\`\`\`yaml\n${prefix}${this.id} ${typeAnime}\`\`\``,
          true
        )
      })

      message.util.reply(embedTypes)
      return
    }

    try {
      
      if (
        !Object.values(types).includes(typeAnimeSelected as typeOfTypes) &&
        typeAnimeSelected !== undefined
      ) {
        message.util.reply(
          `o tipo de top de anime digitado é inválido, utilize:\n${Object.keys(
            types
          )
            .map((typeAnime) => `\`${typeAnime}\``)
            .join('\n')}`
        )
        return
      }

      const result =
        typeAnimeSelected === undefined
          ? await JikanTS.Top.items('anime', 1)
          : await JikanTS.Top.items(
              'anime',
              1,
              typeAnimeSelected as typeOfTypes
            )
      const pageAnime = result.top.slice(10 * (page - 1), 10 * page)

      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`**TOP 10 animes ${type || 'tv'}**`)
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      if (pageAnime.length == 0) {
        embed.addField(
          'A página selecionada não possuí nenhum item disponível.',
          '\u200B'
        )
      } else {
        pageAnime[0].image_url && embed.setImage(pageAnime[0].image_url)
        pageAnime.forEach((anime, index) => {
          
          embed.addField(
            `> ${anime.title} __#${anime.rank}__`,
            `Acesse a página do anime [aqui](${anime.url})`,
            true
          )
          if (index % 2) {
            embed.addField(`\u200B`, `\u200B`, false)
          }
        })
      }

      const messageTopList = await message.util.reply(embed)

      result.top.slice(10 * (page - 2), 10 * (page - 1)).length > 0 &&
        (await messageTopList.react('⬅️'))
      result.top.slice(10 * page, 10 * (page + 1)).length > 0 &&
        (await messageTopList.react('➡️'))
      result.top.slice(10 * page, 10 * (page + 1)).length == 0 &&
        result.top.slice(10 * (page - 2), 10 * (page - 1)).length == 0 &&
        (await messageTopList.react('🏠'))

      const reactionsOptions = {
        '🏠': 1,
        '⬅️': page - 1,
        '➡️': page + 1,
      }

      const filterReactions: CollectorFilter = (reaction, user) =>
        Object.keys(reactionsOptions).includes(reaction.emoji.name) &&
        user.id === message.author.id

      const reaction = await messageTopList.awaitReactions(filterReactions, {
        max: 1,
      })

      const newPage = reactionsOptions[reaction.first().emoji.name]

      if (newPage) {
        await messageTopList.reactions.removeAll()
        this.exec(message, {
          type,
          page: newPage,
        })
      }
    } catch (error) {
      
      message.util.reply('Houve um erro ao buscar o top de animes.')
    }
  }
}

export default TopAnimesCommand
