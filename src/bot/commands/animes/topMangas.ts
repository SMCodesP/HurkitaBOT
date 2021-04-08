import { Command } from 'discord-akairo'
import { CollectorFilter, MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'
import { BotClientTypes } from '../../index'
import * as db from 'quick.db'
import JikanTS from 'jikants'

type typeOfTypes =
  | 'manga'
  | 'novels'
  | 'oneshots'
  | 'doujin'
  | 'manhwa'
  | 'manhua'

const types: {
  [type: string]: typeOfTypes
} = {
  manga: 'manga',
  novels: 'novels',
  oneshots: 'oneshots',
  doujin: 'doujin',
  manhwa: 'manhwa',
  manhua: 'manhua',
}

class TopMangasCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('topmangas', {
      aliases: ['topmangas'],
      category: '🦊 Animes | animes',
      description: {
        content: 'Com esse comando você listar o top de mangás.',
        metadata: 'Comando para top mangas;',
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
    const typeMangaSelected: typeOfTypes = types[type]

    if (type === 'list') {
      const embedTypes = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle("Lista de top's de mangás")
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      Object.keys(types).forEach((typeManga) => {
        embedTypes.addField(
          `> ${typeManga}`,
          `\`\`\`yaml\n${prefix}${this.id} ${typeManga}\`\`\``,
          true
        )
      })

      message.util.reply(embedTypes)
      return
    }

    try {
      if (
        !Object.values(types).includes(typeMangaSelected as typeOfTypes) &&
        typeMangaSelected !== undefined
      ) {
        message.util.reply(
          `o tipo de top de mangá digitado é inválido, utilize:\n${Object.keys(
            types
          )
            .map((typeManga) => `\`${typeManga}\``)
            .join('\n')}`
        )
        return
      }

      const result =
        typeMangaSelected === undefined
          ? await JikanTS.Top.items('manga', 1)
          : await JikanTS.Top.items(
              'manga',
              1,
              typeMangaSelected as typeOfTypes
            )
      const pageManga = result.top.slice(10 * (page - 1), 10 * page)

      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`**TOP 10 mangás ${type || 'manga'}**`)
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      if (pageManga.length == 0) {
        embed.addField(
          'A página selecionada não possuí nenhum item disponível.',
          '\u200B'
        )
      } else {
        pageManga[0].image_url && embed.setImage(pageManga[0].image_url)
        pageManga.forEach((manga, index) => {
          
          embed.addField(
            `> ${manga.title} __#${manga.rank}__`,
            `Acesse a página do mangá [aqui](${manga.url})`,
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
      
      message.util.reply('Houve um erro ao buscar o top de mangás.')
    }
  }
}

export default TopMangasCommand
