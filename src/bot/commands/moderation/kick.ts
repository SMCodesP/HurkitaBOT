import * as db from 'quick.db'
import { Message, GuildMember } from 'discord.js'
import { Command } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import intlOptionsDate from '../../../utils/intlOptionsDate'

class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick', 'expulsar'],
      category: '👮‍♂️ Moderação | mod',
      description: {
        type_log: 'expulsoes',
        content: 'Nesse comando você consegue expulsar um membro do servidor.',
        metadata: 'Comando para expulsar; kick;',
        usage: '[command] [@member/memberID] {razão}',
        examples: [
          '[command] 360247173356584960 Spam no chat',
          '[command] @SMCodes#4207',
        ],
      },
      args: [
        {
          id: 'memberKicked',
          type: async (message: Message, member: GuildMember | string) => {
            if (message.mentions.members.first())
              return message.mentions.members.first()
            if (typeof member === 'string') {
              try {
                return await message.guild.members.fetch(member)
              } catch (error) {
                return null
              }
            }
            return null
          },
        },
        {
          id: 'reason',
          type: 'string',
          default: 'Nenhuma razão mencionada.',
          match: 'restContent',
        },
      ],
    })
  }

  async exec(
    message: Message,
    { memberKicked, reason }: { memberKicked: GuildMember; reason: string }
  ) {
    const guildRefresh = await message.guild.fetch()

    const authorMember = message.member,
      owner = await guildRefresh.members.fetch(guildRefresh.ownerID),
      meMember = guildRefresh.me

    if (!memberKicked)
      return message.reply(
        'Por favor mencione um membro válido para ser expulsado.'
      )
    if (!meMember.hasPermission('KICK_MEMBERS'))
      return message.reply('Eu não tenho permissão para expulsar membros.')
    if (
      !authorMember.hasPermission('KICK_MEMBERS') &&
      owner.id !== authorMember.id
    )
      return message.reply('Você não tem permissão de expulsar membros.')
    if (authorMember.id === memberKicked.id)
      return message.reply('Você não pode expulsar a si mesmo.')
    if (memberKicked.id === owner.id)
      return message.reply('Você não pode expulsar o rei.')
    if (memberKicked.roles.highest.position >= meMember.roles.highest.position)
      return message.reply(
        'Eu não posso expulsar um usuário que está acima do meu cargo.'
      )
    if (
      memberKicked.roles.highest.position >= authorMember.roles.highest.position
    )
      return message.reply(
        'Você não tem permissão para expulsar um membro que tenha um cargo mais alto que você.'
      )
    if (!memberKicked.kickable)
      return message.reply(
        `O usuário ${memberKicked}, não pode ser banido por algum motivo.`
      )

    try {
      const nowDate = new Date()
      const embed = new MessageEmbed()
        .setTitle('🚪 Log de expulsão')
        .setColor('RANDOM')
        .addField(
          '👤 Usuário expulsado »',
          `\`\`\`diff\n- ${memberKicked.user.tag}\`\`\``,
          true
        )
        .addField(
          '👤 Expulsado por »',
          `\`\`\`yaml\n${message.author.tag}\`\`\``,
          true
        )
        .addField(
          '⏲️ Data de expulsão »',
          `\`\`\`yaml\n${new Intl.DateTimeFormat(
            'pt-BR',
            intlOptionsDate
          ).format(nowDate)}\`\`\``,
          false
        )
        .addField('📃 Razão »', `\`\`\`yaml\n${reason}\`\`\``, false)
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      memberKicked.user.send(
        `Você foi expulso do servidor \`${guildRefresh.name}\`, por \`${message.author.tag}\`.`
      )
      await memberKicked.kick(reason)
      await message.reply(
        `Você expulsou o usuário \`${memberKicked.user.tag}\` com sucesso!`
      )

      const channel_log_id = db.get(
        `${message.guild.id}.log.${this.description.type_log}`
      )

      if (channel_log_id) {
        try {
          const channel_log = message.guild.channels.cache.get(channel_log_id)

          if (channel_log.isText()) {
            channel_log.send(embed)
          }
        } catch (error) {
          message.util.reply('Houve erro ao criar o log do kick.')
        }
      }
    } catch (error) {
      return message.reply(`Houve um erro ao banir o usuário: ${error}`)
    }
  }
}

export default KickCommand
