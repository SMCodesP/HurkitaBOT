import { Message, MessageEmbed } from 'discord.js'
import { Command } from 'discord-akairo'
import { BotClientTypes } from '../../index'
import * as db from 'quick.db'

class SearchCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('search', {
      aliases: ['search', 'buscar', 'pesquisar'],
      category: '🛠️ Utilitários | utils',
      description: {
        content:
          'Com esse comando você pode pesquisar um outro comando com apenas características dele.',
        metadata: 'Comando para pesquisar outros comandos',
        usage: '[command] [Um texto de pesquisa]',
        examples: [
          '[command] Comando para expulsar um usuário.',
          '[command] Um comando para me ajudar.',
        ],
      },
      args: [
        {
          id: 'query',
          type: 'string',
          match: 'content',
        },
      ],
    })
  }

  async exec(message: Message, { query }: { query: string }) {
    const embedOfSearching = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('🔎 Buscando...')
      .setDescription(
        '⚠️ **Atenção »** Essa ferramenta é experimental, provavelmente não funcionará com todos os comandos.\n \u200B'
      )
      .setTimestamp()
      .setFooter(
        `Copyright © 2021 - ${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )

    const messageEmbedOfSearching = await message.channel.send(embedOfSearching)

    try {
      const response = await this.client.sonicChannelSearch.query(
        'commands_test',
        'default',
        query,
        {
          lang: 'por',
          limit: 3,
        }
      )

      const embedOfSearch = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('🔎 Lista de comandos encontrados!')
        .setDescription(
          '⚠️ **Atenção »** Essa ferramenta é experimental, provavelmente não funcionará com todos os comandos.\n \u200B'
        )
        .setTimestamp()
        .setFooter(
          `Copyright © 2021 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      if (response.length <= 0) {
        embedOfSearch.addField('Nenhum comando encontrado.', '\n \u200B')
      } else {
        response.forEach((command) => {
          embedOfSearch.addField(
            `- Comando encontrado ${command}, use o comando abaixo para mais informações `,
            `\`\`\`yaml\n${
              db.get(`${message.guild.id}.prefix`) || process.env.PREFIX
            }help ${command}\`\`\``
          )
        })
      }

      messageEmbedOfSearching.edit(embedOfSearch)
    } catch (err) {
      
      await messageEmbedOfSearching.delete()
      message.reply(`Houve um erro ao pesquisar o comando: ${err.message}`)
    }
  }
}

export default SearchCommand
