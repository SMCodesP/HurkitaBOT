import type ServerInfo from '../../structures/entities/ServerInfo'

import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import axios from 'axios'
import { BotClientTypes } from '../../index'
import { MessageEmbed } from 'discord.js'

class McServerCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('mc-server', {
      aliases: ['mc-server'],
      category: '814841361983340544 Minecraft | minecraft',
      description: {
        content: 'Comando para ver o status de um servidor de minecraft.',
        metadata: 'Comando para visualizar status; servidor',
        usage: '[command] [IP do servidor]',
        examples: ['[command] 192.0.0.1', '[command] mc.smcodes.tk'],
      },
      args: [
        {
          id: 'serverIp',
          type: 'string',
        },
      ],
    })
  }

  async exec(message: Message, { serverIp }: { serverIp?: string }) {
    const embedLoading = new MessageEmbed()
      .setTitle('**MC-Status**')
      .setColor('RANDOM')
      .setDescription(`Status do servidor: \`${serverIp}\``)
      .addField('\u200B', '**Carregando informações...**\n\u200B')
      .setTimestamp()
      .setFooter(
        `Copyright © 2020 - ${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )

    await message.util.reply(embedLoading)

    try {
      const {
        data: response,
      }: {
        data: ServerInfo
      } = await axios.get(`https://api.mcsrvstat.us/2/${serverIp}`)

      if (!response.online) throw new Error('Servidor offline')

      const embed = new MessageEmbed()
        .setTitle('**MC-Status**')
        .setColor('RANDOM')
        .setThumbnail(`https://api.mcsrvstat.us/icon/${serverIp}`)
        .setDescription(
          `Status do servidor: \`${serverIp}\`\n\n\n**Motd »**\n\`\`\`yaml\n${response.motd.clean
            .toString()
            .trim()}\`\`\``
        )
        .addField('> **Status »**', `\`\`\`yaml\nonline\`\`\``, true)
        .addField(
          '> **Players »**',
          `\`\`\`yaml\n${response.players.online}/${response.players.max}\`\`\``,
          true
        )
        .addField(
          '> **Versão »**',
          `\`\`\`diff\n- ${response.version}\`\`\`\n\u200B`,
          false
        )
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      await message.util.reply({ embed })
    } catch (error) {
      console.log(error.message)
      const embed = new MessageEmbed()
        .setTitle('**MC-Status**')
        .setColor('RANDOM')
        .setDescription(`Status do servidor: \`${serverIp}\``)
        .addField(
          '\u200B',
          `<:error:799624539226767412> ${
            error.message || 'Houve um erro ao buscar as informações.'
          }\n\u200B`
        )
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      await message.util.reply({ embed })
    }
  }
}

export default McServerCommand
