import { Command } from 'discord-akairo'
import { Anime } from 'malapi'
import JikanTS from 'jikants'
import { Message, MessageEmbed } from 'discord.js'
import * as db from 'quick.db'
import * as translatte from 'translatte'
import { BotClientTypes } from '../../index'

class AnimeInfoCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('infoanime', {
      aliases: ['infoanime', 'ianime'],
      category: '🦊 Animes | animes',
      description: {
        content: 'Pesquisar informações sobre um anime!',
        metadata: 'Comando de search; pesquisar; anime',
        usage: '[command] [Título do anime]',
        examples: ['[command] Youkoso Jitsuryoku', '[command] Naruto'],
      },
      args: [
        {
          id: 'animeTitle',
          type: 'string',
          match: 'content',
        },
      ],
    })
  }

  async exec(message: Message, { animeTitle }: { animeTitle: string }) {
    const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX

    if (!animeTitle)
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
      const responseMal = await Anime.fromName(animeTitle)
      const response = await JikanTS.Anime.byId(Number(responseMal.id))

      const description = await translatte(
        response.synopsis.substring(0, 1000),
        {
          to: 'pt',
        }
      )

      const embedAnime = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(response.title)
        .setDescription(
          `Fonte **[MyAnimeList](${response.url})**.\n**[Trailer](${response.trailer_url})**\n**Sinopse (Traduzida) »**\n${description.text}...\n\u200B`
        )
        .addField('ID »', `\`\`\`diff\n- ${response.mal_id}\`\`\``, false)
        .addField(
          'Classificação »',
          `\`\`\`yaml\n${response.rating}\`\`\``,
          true
        )
        .addField('Episódios »', `\`\`\`yaml\n${response.episodes}\`\`\``, true)
        .addField(
          'Gêneros »',
          `\`\`\`yaml\n[${response.genres
            .map((genre) => genre.name)
            .join(', ')}]\`\`\``,
          false
        )
        .addField('Transmitido »', `\`\`\`yaml\n${response.type}\`\`\``, true)
        .addField(
          'Studios »',
          `\`\`\`yaml\n[${response.studios
            .map((studio) => studio.name)
            .join(', ')}]\`\`\``,
          true
        )
        .addField('Membros »', `\`\`\`yaml\n${response.members}\`\`\``, false)
        .addField(
          'Popularidade »',
          `\`\`\`yaml\n${response.popularity}\`\`\``,
          true
        )
        .addField('Avaliação »', `\`\`\`yaml\n${response.score}\`\`\``, true)
        .addField(
          'Favoritados »',
          `\`\`\`yaml\n${response.favorites}\`\`\``,
          true
        )
        .addField(
          'Licenciadores »',
          `[${response.licensors
            .map((licensor) => `[${licensor.name}](${licensor.url})`)
            .join(', ')}]`,
          false
        )
        .addField(
          'Produtores »',
          `[${response.producers
            .map((producer) => `[${producer.name}](${producer.url})`)
            .join(', ')}]`,
          false
        )
        .setImage(response.image_url)
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      message.util.reply(embedAnime)
    } catch (error) {
      console.bot(error)
      message.util.reply(
        'Houve um erro ao buscar o anime, tente novamente mais tarde.'
      )
    }
  }
}

export default AnimeInfoCommand
