import { Command } from 'discord-akairo'
import JikanTS from 'jikants'
import { CollectorFilter, Message, MessageEmbed } from 'discord.js'
import * as db from 'quick.db'
import { BotClientTypes } from '../../index'

class MalUserCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('maluser', {
      aliases: ['maluser'],
      category: '🦊 Animes | animes',
      description: {
        content: 'Pesquisar informações sobre um usuário do MyAnimeList!',
        metadata: 'Comando de search; usuário; anime',
        usage: '[command] [Usuário do MyAnimeList]',
        examples: ['[command] SMCodes'],
      },
      args: [
        {
          id: 'malUser',
          type: 'string',
          match: 'content',
        },
      ],
    })
  }

  async exec(
    message: Message,
    {
      malUser,
      page = 1,
    }: {
      malUser: string
      page: number
    }
  ) {
    const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX

    if (!malUser)
      return message.util.reply(
        `Sintaxe incorreta, utilize o comando dessa forma \`${this.description.usage.replace(
          '[command]',
          `${prefix}${this.id}`
        )}\`.`
      )

    const embedAnimeLoading = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Carregando...')
      .setTimestamp()
      .setFooter(
        `Copyright © 2020 - ${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )

    await message.util.reply(embedAnimeLoading)

    try {
      const simpleEmbedTemplate = new MessageEmbed()
        .setColor('RANDOM')
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      const embeds = {
        1: async () => {
          const response = await JikanTS.User.profile(malUser)
          console.log(response.image_url)
          return simpleEmbedTemplate
            .setTitle(`Perfil de __${response.username}__`)
            .setDescription(
              `Fonte **[MyAnimeList](https://myanimelist.net)**.\nClique **[aqui](${response.url})** para saber mais.`
            )
            .addField(
              'Nome »',
              `\`\`\`diff\n- ${response.username}\`\`\``,
              false
            )
            .addField(
              'Mangás favoritos »',
              `\`\`\`yaml\n${response.favorites.manga.length}\`\`\``,
              true
            )
            .addField(
              'Peronsagens favoritos »',
              `\`\`\`yaml\n${response.favorites.characters.length}\`\`\``,
              true
            )
            .addField(
              'Animes favoritos »',
              `\`\`\`yaml\n${response.favorites.anime.length}\`\`\``,
              true
            )
            .addField(
              'Sobre »',
              `\`\`\`yaml\n${
                response.about || 'Nenhuma descrição sobre o usuário.'
              }\`\`\``,
              false
            )
            .addField(
              'Animes completados »',
              `\`\`\`yaml\n${response.anime_stats.completed}\`\`\``,
              true
            )
            .addField(
              'Assistindo »',
              `\`\`\`yaml\n${response.anime_stats.watching}\`\`\``,
              true
            )
            .addField(
              'Animes dropados »',
              `\`\`\`yaml\n${response.anime_stats.dropped}\`\`\``,
              true
            )
            .addField(
              'Total de episódios assistidos »',
              `\`\`\`yaml\n${response.anime_stats.episodes_watched}\`\`\``,
              true
            )
            .setImage(response.image_url)
        },
        2: async () => {
          const response = await JikanTS.User.profile(malUser)
          const description = `Fonte **[MyAnimeList](https://myanimelist.net)**.\n\n${
            response.favorites.anime.length > 0
              ? response.favorites.anime.map(
                  (anime) => `${anime.mal_id} - \`${anime.name}\`\n`
                )
              : 'Nenhum anime favoritado.'
          }`
          return simpleEmbedTemplate
            .setTitle(`Animes favoritos de __${malUser}__`)
            .setDescription(
              description.length < 2020
                ? description
                : description.substring(0, 2020) + '\n...'
            )
        },
      }

      const messageEmbedMalUser = await message.util.reply(await embeds[page]())

      embeds[page - 1] && (await messageEmbedMalUser.react('⬅️'))
      embeds[page + 1] && (await messageEmbedMalUser.react('➡️'))

      const reactionsOptions = {
        '⬅️': page - 1,
        '➡️': page + 1,
      }

      const filterReactions: CollectorFilter = (reaction, user) =>
        Object.keys(reactionsOptions).includes(reaction.emoji.name) &&
        user.id === message.author.id

      const reaction = await messageEmbedMalUser.awaitReactions(
        filterReactions,
        {
          max: 1,
        }
      )

      const newPage = reactionsOptions[reaction.first().emoji.name]

      if (newPage) {
        await messageEmbedMalUser.reactions.removeAll()
        this.exec(message, {
          malUser,
          page: newPage,
        })
      }
    } catch (error) {
      console.bot(error)
      await message.util.reply(
        'Houve um erro ao buscar o anime, tente novamente mais tarde.'
      )
    }
  }
}

export default MalUserCommand
