import { Message } from 'discord.js'
import { Command } from 'discord-akairo'
import * as db from 'quick.db'
import { RoleBot } from '../../structures/entities/RoleBot'
import { MessageEmbed } from 'discord.js'
import { MessageReaction } from 'discord.js'
import { User } from 'discord.js'
import paginate from '../../../utils/paginate'

class ListRoles extends Command {
  constructor() {
    super('listroles', {
      aliases: ['listroles', 'listarcargos'],
      category: '👷 Funcionários | workers',
      description: {
        content: 'Listar todos os cargos dentro do bot!',
        metadata: 'List roles; cargos; listar cargos;',
        usage: '[command]',
        examples: ['[command]'],
      },
      args: [
        {
          id: 'page',
          default: 1,
          type: 'number',
        },
      ],
    })
  }

  async exec(message: Message, { page }: { page: number }) {
    const roles = db.get(`roles`)

    if (!roles)
      return message.util.reply('nenhum cargo disponível até o momento.')

    const rolesList: Array<RoleBot> = Object.values(roles)
    const rolesListPages: Array<Array<RoleBot>> = paginate(rolesList, 3)
    const rolesListPage: Array<RoleBot> = rolesListPages[page - 1]

    const embedListRoles = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`📂 Lista de cargos no meu sistema - página ${page}`)
      .setDescription(
        !rolesListPage || rolesListPages[page] || rolesListPages[page - 2]
          ? '**Para mudar de página você precisa reagir abaixo dentre 5 minutos**\n \u200B'
          : '\n \u200B'
      )
      .setTimestamp()
      .setFooter(
        `Copyright © 2021 - ${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )

    if (rolesListPage) {
      rolesListPage.forEach((role) => {
        embedListRoles
          .addField(
            '\n**Nome do cargo »**',
            `\`\`\`diff\n- ${role.name}\`\`\``,
            false
          )
          .addField(
            '**Setar cargo »**',
            `\`\`\`yaml\n${
              db.get(`${message.guild.id}.prefix`) || process.env.PREFIX
            }addbotrole ${role.name} @user\`\`\`\n \u200B`,
            true
          )
      })
    } else {
      embedListRoles.addField(
        '\n\nNenhum cargo disponível nessa página.',
        '\n\n \u200B'
      )
    }

    const messageListRoles = await message.channel.send(embedListRoles)

    if (rolesListPage) {
      if (rolesListPages[page]) await messageListRoles.react('➡️')
      if (rolesListPages[page - 2]) await messageListRoles.react('⬅️')
    } else {
      await messageListRoles.react('🏠')
    }

    const filter = (_: MessageReaction, user: User) =>
      user.id === message.author.id

    const collectorReaction = messageListRoles.createReactionCollector(filter, {
      time: 60000 * 5,
    })

    const functionsReactions = {
      '⬅️': async () => {
        if (rolesListPages[page - 2]) {
          await messageListRoles.delete()
          this.exec(message, { page: page - 1 })
        }
      },
      '➡️': async () => {
        if (rolesListPages[page]) {
          await messageListRoles.delete()
          this.exec(message, { page: page + 1 })
        }
      },
      '🏠': async () => {
        await messageListRoles.delete()
        this.exec(message, { page: 1 })
      },
    }

    collectorReaction.on('collect', (reaction) => {
      if (functionsReactions[reaction.emoji.name])
        return functionsReactions[reaction.emoji.name]()
    })
  }
}

export default ListRoles
