import { CollectorFilter, Message, MessageEmbed } from 'discord.js'
import { Command } from 'discord-akairo'

import { BotClientTypes } from '../../'
import getPrefix from '../../../utils/getPrefix'
import axios from 'axios'
import paginate from '../../../utils/paginate'

class Mp3Lyrics extends Command {
  client: BotClientTypes

  constructor() {
    super('mp3lyrics', {
      aliases: ['mp3lyrics', 'mp3letra'],
      category: '📻 Mp3 rádio | mp3',
      channel: 'guild',
      description: {
        content: 'Comando para procurar a letra de uma música!',
        metadata: 'Mp3 lyrics letra pesquisar search',
        usage: '[command] [Música]',
      },
      args: [
        {
          id: 'searchQuery',
          match: 'content',
        },
      ],
    })
  }

  async exec(message: Message, { searchQuery }: { searchQuery: string }) {
    try {
      if (!searchQuery)
        throw new Error(
          `sintaxe incorreta, você deve usar o comando dessa forma \`${getPrefix(
            message.guild.id
          )}${this.id} [Música]\`.`
        )

      await message.util.reply(
        new MessageEmbed()
          .setColor('RANDOM')
          .setTitle('Carregando...')
          .setTimestamp()
          .setFooter(
            `Copyright © 2021 - ${this.client.user.username}`,
            this.client.user.displayAvatarURL()
          )
      )

      const { data } = await axios.get(
        `https://api.vagalume.com.br/search.excerpt?` +
          `apikey=${process.env.VAGALUME_CREDENTIAL}&` +
          `q=${searchQuery}&` +
          `limit=1`
      )

      if (data.response.docs.length === 0)
        throw new Error('Nenhuma letra encontrada.')

      const song = data.response.docs[0]

      const {
        data: { mus },
      } = await axios.get(
        `https://api.vagalume.com.br/search.php?` +
          `apikey=${process.env.VAGALUME_CREDENTIAL}&` +
          `musid=${song.id}`
      )

      const pages = paginate(
        mus[0].text.split(''),
        2048 - (40 + mus[0].url.length)
      )
      console.log(pages)

      const runEmbed = async (page: number) => {
        console.log('runEmbed')
        console.log(page)
        const embedLyrics = new MessageEmbed()
          .setColor('RANDOM')
          .setTitle(`📻 Letra da música ${song.title}`)
          .setDescription(
            `**Acesse a letra completa [aqui](${mus[0].url})**\n\n${pages[
              page
            ].join('')}`
          )
          .setTimestamp()
          .setFooter(
            `Copyright © 2021 - ${this.client.user.username}`,
            this.client.user.displayAvatarURL()
          )

        const messageLyrics = await message.util.reply(embedLyrics)

        pages[page - 1] && (await messageLyrics.react('⬅️'))
        pages[page + 1] && (await messageLyrics.react('➡️'))

        const reactionsOptions = {
          '⬅️': page - 1,
          '➡️': page + 1,
        }

        const filterReactions: CollectorFilter = (reaction, user) =>
          Object.keys(reactionsOptions).includes(reaction.emoji.name) &&
          user.id === message.author.id

        const reaction = await messageLyrics.awaitReactions(filterReactions, {
          max: 1,
        })

        console.log('reaction')

        const newPage = reactionsOptions[reaction.first().emoji.name]

        console.log(newPage)

        if (newPage !== null && newPage !== undefined) {
          await messageLyrics.reactions.removeAll()
          await runEmbed(newPage)
        }
      }
      await runEmbed(0)
    } catch (error) {
      console.error(error)
      return message.util
        .reply(
          new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('📻 MP3 letras error')
            .setDescription(`\n${error.message}`)
            .setTimestamp()
            .setFooter(
              `Copyright © 2021 - ${this.client.user.username}`,
              this.client.user.displayAvatarURL()
            )
        )
        .catch(console.error)
    }
  }
}

export default Mp3Lyrics
