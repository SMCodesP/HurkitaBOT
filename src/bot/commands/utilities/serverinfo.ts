import { Message, MessageEmbed } from 'discord.js'
import { Command } from 'discord-akairo'
import { BotClientTypes } from '../../index'
import flagsEmojis from '../../../utils/flagsEmojis'
import * as db from 'quick.db'
import { MessageReaction } from 'discord.js'
import { User } from 'discord.js'
import { MessageOptions } from 'discord.js'
import { MessageAttachment } from 'discord.js'
import { APIMessage } from 'discord.js'
import { MessageEditOptions } from 'discord.js'

class ServerInfoCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('serverinfo', {
      aliases: ['serverinfo'],
      category: '🛠️ Utilitários | utils',
      description: {
        content:
          'Esse comando você pode saber informações sobre esse servidor.',
        metadata: 'Comando informações servidores; servidor; information;',
        usage: '[command]',
        examples: ['[command]'],
      },
    })
  }

  async exec(
    message: Message,
    { page = 0, messageAlt }: { page: number; messageAlt: Message }
  ) {
    if (messageAlt) {
      messageAlt = await messageAlt.fetch()
    }

    const pages = {
      0: async () => {
        const guild = await message.guild.fetch()
        const roles = guild.roles.cache.mapValues((role) => role.name)
        const guildOwner = await guild.members.fetch(guild.ownerID)

        return new MessageEmbed()
          .setColor('RANDOM')
          .setThumbnail(guild.iconURL())
          .setTitle(`📃 Informações do servidor | ${page + 1}`)
          .setDescription(
            `Essas são as informações sobre o servidor **${guild.name}**`
          )
          .addField(
            `\u200B`,
            `🔤 **Nome » ** \`\`\`yaml\n${guild.name}\`\`\``,
            true
          )
          .addField(
            `\u200B`,
            `🆔 **ID » ** \`\`\`yaml\n${guild.id}\`\`\``,
            true
          )
          .addField(
            `\u200B`,
            `👨‍👧‍👦 **Membros » ** \`\`\`yaml\n${guild.memberCount}\`\`\``,
            true
          )
          .addField(
            `\u200B`,
            `🛡️ **Cargos » ** \`\`\`yaml\n${guild.roles.cache.size}\`\`\``,
            true
          )
          .addField(
            `\u200B`,
            `📢 **Canais texto/voz » ** \`\`\`yaml\n${
              guild.channels.cache.filter(
                (channelCount) => channelCount.type === 'text'
              ).size
            }/${
              guild.channels.cache.filter(
                (channelCount) => channelCount.type === 'voice'
              ).size
            }\`\`\``,
            true
          )
          .addField(
            `\u200B`,
            `${
              this.client.emojis.cache.get(flagsEmojis[guild.region]) || '🏳️'
            } **Região » ** \`\`\`yaml\n${guild.region}\`\`\``,
            true
          )
          .addField(
            `\u200B`,
            `👤 **Criador(a) » ** \`\`\`diff\n- ${guildOwner.user.tag}\`\`\``,
            false
          )
          .addField(
            `\u200B`,
            `<:586789843015565332:780881891032039464> **Cargos » ** \`\`\`ini\n[${roles
              .array()
              .join(', ')}]\`\`\` \n \u200B`,
            false
          )
          .setTimestamp()
          .setFooter(
            `Copyright © 2021 ${this.client.user.username}`,
            this.client.user.avatarURL()
          )
      },
      1: async () => {
        const guild = await message.guild.fetch()

        return new MessageEmbed()
          .setColor('RANDOM')
          .setThumbnail(guild.iconURL())
          .setTitle('📃 Informações do servidor')
          .setDescription(
            `Essas são as informações sobre o servidor **${guild.name}**`
          )
          .addField(
            `\u200B`,
            `**Prefix »** \`\`\`yaml\n${
              db.get(`${guild.id}.prefix`) || process.env.PREFIX
            }\`\`\``,
            true
          )
          .addField(
            `\u200B`,
            `**Emojis »** \`\`\`yaml\n${guild.emojis.cache.size}\`\`\``,
            true
          )
          .setTimestamp()
          .setFooter(
            `Copyright © 2021 ${this.client.user.username}`,
            this.client.user.avatarURL()
          )
      },
    }

    if (!pages[page]) {
      if (!messageAlt) {
        message.channel.send(`página de informação não encontrada.`)
      } else {
        messageAlt.edit(`página de informação não encontrada.`)
      }
      return
    }

    let messageInfo: Message

    if (!messageAlt) {
      messageInfo = await message.channel.send(await pages[page]())
    } else {
      messageInfo = await messageAlt.edit(await pages[page]())
    }

    if (pages[page + 1]) {
      await messageInfo.react('➡️')
    }
    if (pages[page - 1]) {
      await messageInfo.react('⬅️')
    }

    const filter = (_: MessageReaction, user: User) =>
      user.id === message.author.id
    const collectorReaction = messageInfo.createReactionCollector(filter, {
      time: 60000 * 5,
      max: 1,
    })

    const functionsReactions = {
      '⬅️': async () => {
        await messageInfo.reactions.removeAll()
        this.exec(message, { page: page - 1, messageAlt: messageInfo })
      },
      '➡️': async () => {
        await messageInfo.reactions.removeAll()
        this.exec(message, { page: page + 1, messageAlt: messageInfo })
      },
    }

    collectorReaction.on('collect', async (reaction) => {
      if (functionsReactions[reaction.emoji.name]) {
        await functionsReactions[reaction.emoji.name]()
      }
    })
  }
}

export default ServerInfoCommand
