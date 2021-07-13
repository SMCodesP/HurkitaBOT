import { Command } from 'discord-akairo'
import { CollectorFilter, MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'
import { Anime } from 'malapi'
import { BotClientTypes } from '../../index'
import JikanTS from 'jikants'
import * as db from 'quick.db'
import { Search } from 'jikants/dist/src/interfaces/search/Search'
import axios from 'axios'

class CharacterCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('personagem', {
      aliases: ['personagem', 'character'],
      category: '🦊 Animes | animes',
      description: {
        content: 'Com esse comando você saber mais sobre um personagem.',
        metadata: 'Comando para top peoples;',
        usage: '[command] [personagem]',
        examples: ['[command]', '[command] Ayanokoji'],
      },
      args: [
        {
          id: 'name',
          type: 'string',
          match: 'content',
        },
      ],
    })
  }

  async exec(message: Message, { name }: { name: string }) {
    const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX

    if (!name)
      return message.util.reply(
        `Sintaxe incorreta, utilize o comando dessa forma \`${this.description.usage.replace(
          '[command]',
          `${prefix}${this.id}`
        )}\`.`
      )

    const embedAnimeLoading = new MessageEmbed()
      .setColor('RANDOM')
      .setTimestamp()
      .setFooter(
        `Copyright © 2021 - ${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )

    await message.util.reply(embedAnimeLoading.setTitle('Carregando...'))

    try {
      const {
        data: request,
      }: {
        data: Search
      } = await axios.get(
        `https://api.jikan.moe/v3/search/character?q=${name}&page=1`
      )
      const result = await JikanTS.Character.pictures(request.results[0].mal_id)

      const sendCharacter = async (page: number) => {
        const embedAnime = embedAnimeLoading
          .setTitle((request.results[0] as any).name)
          .setDescription(
            `Clique [aqui](${result.pictures[page].large}) para baixar a imagem\n**ID »**\`\`\`diff\n- ${request.results[0].mal_id}\`\`\``
          )
          .setImage(result.pictures[page].large)

        const messageImage = await message.util.reply(embedAnime)

        result.pictures[page - 1] && (await messageImage.react('⬅️'))
        result.pictures[page + 1] && (await messageImage.react('➡️'))

        const reactionsOptions = {
          '⬅️': page - 1,
          '➡️': page + 1,
        }

        const filterReactions: CollectorFilter = (reaction, user) =>
          Object.keys(reactionsOptions).includes(reaction.emoji.name) &&
          user.id === message.author.id

        const reaction = await messageImage.awaitReactions(filterReactions, {
          max: 1,
        })

        const newPage = reactionsOptions[reaction.first().emoji.name]

        if (newPage) {
          await messageImage.reactions.removeAll()
          sendCharacter(newPage)
        }
      }
      sendCharacter(0)
    } catch (error) {
      message.util.reply(
        'Houve um erro ao buscar o anime, tente novamente mais tarde.'
      )
    }
  }
}

export default CharacterCommand
