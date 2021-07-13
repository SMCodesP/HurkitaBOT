import { Command } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'
import * as db from 'quick.db'
import axios from 'axios'
import { BotClientTypes } from '../../index'

const nsfwTypes = ['waifu', 'neko', 'trap', 'blowjob']

class AnimeNSFWCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('nanime', {
      aliases: ['nanime'],
      category: '🔞 NSFW | nsfw',
      description: {
        content:
          'Com esse comando você pode gerar uma imagem nsfw de anime, você pode usar o comando nwa para pesquisar uma imagem nsfw de acordo com seu pedido.',
        metadata: 'Comando para gerar waifu; anime;',
        usage: '[command] {waifu/neko/trap/blowjob}',
        examples: ['[command] waifu', '[command] neko', '[command]'],
      },
      args: [
        {
          id: 'type',
          type: 'string',
        },
      ],
    })
  }

  async exec(message: Message, { type }: { type: string }) {
    if (message.channel.type !== 'text')
      return message.util.reply(
        'Você não pode executar um comando nsfw nesse canal.'
      )
    if (!message.channel.nsfw)
      return message.util.reply(
        'O canal não é um nsfw então você não pode executar esse comando aqui.'
      )

    const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX
    if (!type) {
      type = nsfwTypes[Math.floor(Math.random() * nsfwTypes.length)]
    }

    if (type === 'list') {
      const embedTypes = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Lista de tipos de nsfw')
        .setDescription(
          `Para você buscar uma imagem NSFW de acordo com uma pesquisa utilize \`${prefix}nwa [anime/personagem/pesquisa]\``
        )
        .setTimestamp()
        .setFooter(
          `Copyright © 2021 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      nsfwTypes.forEach((typeNSFW) => {
        embedTypes.addField(
          `${typeNSFW}`,
          `\`\`\`yaml\n${prefix}${this.id} ${typeNSFW}\`\`\``,
          true
        )
      })

      message.util.reply(embedTypes)
      return
    }

    if (!nsfwTypes.includes(type))
      return message.util.reply(
        `Esse tipo de nsfw não tenho.\nUse \`${prefix}${this.id} list\` para listar todas categorias.`
      )

    try {
      const image = await axios.get(`https://waifu.pics/api/nsfw/${type}`)

      if (!image.data.url)
        return message.util.reply(
          `Não houve nenhum nsfw encontrado de ${type}.`
        )

      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(
          `Clique [aqui](${image.data.url}) para baixar o NSFW.\nPara você buscar uma imagem NSFW com uma ótima qualidade de acordo com um termo utilize \`${prefix}nwa [anime/personagem/pesquisa]\``
        )
        .setImage(image.data.url)

      message.util.reply(embed)
    } catch (error) {
      
      message.util.reply(
        'Houve um erro ao buscar o nsfw, tente novamente mais tarde.'
      )
    }
  }
}

export default AnimeNSFWCommand
