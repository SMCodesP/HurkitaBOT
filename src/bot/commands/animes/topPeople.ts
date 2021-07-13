import { Command } from 'discord-akairo'
import { CollectorFilter, MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'
import { BotClientTypes } from '../../index'
import JikanTS from 'jikants'

class TopPeoplesCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('toppersonagem', {
      aliases: ['toppersonagem', 'topperson', 'toppeople'],
      category: '🦊 Animes | animes',
      description: {
        content: 'Com esse comando você listar o top de personagens.',
        metadata: 'Comando para top peoples;',
        usage: '[command] {page}',
        examples: ['[command]', '[command] 2'],
      },
      args: [
        {
          id: 'page',
          type: 'number',
          default: 1,
        },
      ],
    })
  }

  async exec(message: Message, { page }: { page: number }) {
    try {
      const result = await JikanTS.Top.items('characters')
      const pagePeople = result.top.slice(10 * (page - 1), 10 * page)

      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`**TOP 10 personagens**`)
        .setTimestamp()
        .setFooter(
          `Copyright © 2021 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      if (pagePeople.length == 0) {
        embed.addField(
          'A página selecionada não possuí nenhum item disponível.',
          '\u200B'
        )
      } else {
        pagePeople[0].image_url && embed.setImage(pagePeople[0].image_url)
        pagePeople.forEach((people, index) => {
          embed.addField(
            `> ${people.title} __#${people.rank}__`,
            `Acesse a página do personagem [aqui](${people.url})`,
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
          page: newPage,
        })
      }
    } catch (error) {
      console.error(error)
      message.util.reply('Houve um erro ao buscar o top de personagens.')
    }
  }
}

export default TopPeoplesCommand
