import { Command } from 'discord-akairo'
import JikanTS from 'jikants'
import { CollectorFilter, Message, MessageEmbed } from 'discord.js'
import * as db from 'quick.db'
import { AnimeUserGenres, AnimeUserStatuses } from 'anilist-node'
import { BotClientTypes } from '../../index'
import anilist = require('anilist-node')

class AniUserCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('aniuser', {
      aliases: ['aniuser'],
      category: '🦊 Animes | animes',
      description: {
        content: 'Pesquisar informações sobre um usuário do AniList!',
        metadata: 'Comando de search; usuário; anime',
        usage: '[command] [Usuário do AniList]',
        examples: ['[command] SMCodes'],
      },
      args: [
        {
          id: 'aniUser',
          type: 'string',
          match: 'content',
        },
      ],
    })
  }

  async exec(
    message: Message,
    {
      aniUser,
      page = 1,
    }: {
      aniUser: string
      page: number
    }
  ) {
    const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX
    const Anilist = new (anilist as any)()

    if (!aniUser)
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
        `Copyright © 2021 - ${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )

    await message.util.reply(embedAnimeLoading)

    try {
      let simpleEmbedTemplate = new MessageEmbed()
        .setColor('RANDOM')
        .setTimestamp()
        .setFooter(
          `Copyright © 2021 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      const embeds = {
        1: async () => {
          const response = await Anilist.user.all(aniUser)

          const timeWatched =
            response.statistics.anime.minutesWatched >= 1440
              ? 1440
              : response.statistics.anime.minutesWatched >= 60
              ? 60
              : 1

          return simpleEmbedTemplate
            .setTitle(`Perfil de __${response.name}__`)
            .setDescription(
              `Fonte **[AniList](https://anilist.co)**.\nClique **[aqui](${response.siteUrl})** para saber mais.`
            )
            .addField('Nome »', `\`\`\`diff\n- ${response.name}\`\`\``, false)
            .addField(
              'Mangás favoritos »',
              `\`\`\`yaml\n${response.favourites.manga.length}\`\`\``,
              true
            )
            .addField(
              'Animes favoritos »',
              `\`\`\`yaml\n${response.favourites.anime.length}\`\`\``,
              true
            )
            .addField(
              'Animes completados »',
              `\`\`\`yaml\n${
                (
                  response.statistics.anime
                    .statuses as unknown as AnimeUserStatuses[]
                ).find((anime) => anime.status === 'COMPLETED').count
              }\`\`\``,
              true
            )
            .addField(
              `${
                timeWatched === 1440
                  ? 'Dias assistidos'
                  : timeWatched === 60
                  ? 'Horas assistidas'
                  : 'Minutos assistidos'
              } »`,
              `\`\`\`yaml\n${(
                response.statistics.anime.minutesWatched / timeWatched
              ).toFixed(2)}\`\`\``,
              false
            )
            .addField(
              'Assistindo »',
              `\`\`\`yaml\n${
                (
                  response.statistics.anime
                    .statuses as unknown as AnimeUserStatuses[]
                ).find((anime) => anime.status === 'CURRENT').count
              }\`\`\``,
              true
            )
            .addField(
              'Planejando assistir »',
              `\`\`\`yaml\n${
                (
                  response.statistics.anime
                    .statuses as unknown as AnimeUserStatuses[]
                ).find((anime) => anime.status === 'PLANNING').count
              }\`\`\``,
              true
            )
            .addField(
              'Episódios assistidos »',
              `\`\`\`ini\n[${response.statistics.anime.episodesWatched}]\`\`\``,
              true
            )
            .setThumbnail(response.avatar.large)
        },
        2: async () => {
          const response = await Anilist.user.all(aniUser)

          ;(response.statistics.anime.genres as unknown as AnimeUserGenres[])
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .forEach((genre, index) => {
              simpleEmbedTemplate.addField(
                `> ${genre.genre}`,
                `**Assistiu » \`${
                  genre.count
                }\`**\n**Horas assistidas » \`${Math.floor(
                  (genre as any).minutesWatched / 60
                )}\`**\n**Pontuação média » \`${genre.meanScore}\`**`,
                true
              )
              if (index % 2) {
                simpleEmbedTemplate.addField(`\u200B`, `\u200B`, false)
              }
            })

          return simpleEmbedTemplate
            .setTitle(`Gêneros mais assistidos por __${response.name}__`)
            .setDescription(
              `Fonte **[AniList](https://anilist.co)**.\nClique **[aqui](${response.siteUrl})** para saber mais.`
            )
            .setThumbnail(response.avatar.large)
        },
      }

      const messageEmbedAniUser = await message.util.reply(await embeds[page]())

      embeds[page - 1] && (await messageEmbedAniUser.react('⬅️'))
      embeds[page + 1] && (await messageEmbedAniUser.react('➡️'))

      const reactionsOptions = {
        '⬅️': page - 1,
        '➡️': page + 1,
      }

      const filterReactions: CollectorFilter = (reaction, user) =>
        Object.keys(reactionsOptions).includes(reaction.emoji.name) &&
        user.id === message.author.id

      const reaction = await messageEmbedAniUser.awaitReactions(
        filterReactions,
        {
          max: 1,
        }
      )

      const newPage = reactionsOptions[reaction.first().emoji.name]

      if (newPage) {
        await messageEmbedAniUser.reactions.removeAll()
        this.exec(message, {
          aniUser,
          page: newPage,
        })
      }
    } catch (error) {
      await message.util.reply(
        'Houve um erro ao buscar o perfil do usuário, tente novamente mais tarde.'
      )
    }
  }
}

export default AniUserCommand
