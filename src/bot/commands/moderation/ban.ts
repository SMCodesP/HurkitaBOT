import * as db from 'quick.db'
import { Message, GuildMember } from 'discord.js'
import { Command } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import intlOptionsDate from '../../../utils/intlOptionsDate'

class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban', 'banir'],
      category: '👮‍♂️ Moderação | mod',
      description: {
        type_log: 'banimentos',
        content:
          'Com esse comando um admnistrador pode banir um membro do servidor.',
        metadata: 'Comando para banir usuários; banir membros; banir; ban;',
        usage: '[command] [@member/memberID] {razão}',
        examples: [
          '[command] 360247173356584960 Spam no chat',
          '[command] @SMCodes#4207',
        ],
      },
      args: [
        {
          id: 'memberBanned',
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
    { memberBanned, reason }: { memberBanned: GuildMember; reason: string }
  ) {
    const guildRefresh = await message.guild.fetch()

    const authorMember = message.member,
      owner = await guildRefresh.members.fetch(guildRefresh.ownerID),
      meMember = guildRefresh.me

    if (!memberBanned)
      return message.reply(
        'Por favor mencione um membro válido para ser banido.'
      )
    if (!meMember.hasPermission('BAN_MEMBERS'))
      return message.reply('Eu não tenho permissão para banir membros.')
    if (
      !authorMember.hasPermission('BAN_MEMBERS') &&
      owner.id !== authorMember.id
    )
      return message.reply('Você não tem permissão de banir membros.')
    if (authorMember.id === memberBanned.id)
      return message.reply('Você não pode banir a si mesmo.')
    if (memberBanned.id === owner.id)
      return message.reply('Você não pode banir o rei.')
    if (memberBanned.roles.highest.position >= meMember.roles.highest.position)
      return message.reply(
        'Eu não posso banir um usuário que está acima do meu cargo.'
      )
    if (
      memberBanned.roles.highest.position >= authorMember.roles.highest.position
    )
      return message.reply(
        'Você não tem permissão para banir um membro que tenha um cargo mais alto que você.'
      )
    if (!memberBanned.bannable)
      return message.reply(
        `O usuário ${memberBanned}, não pode ser banido por algum motivo.`
      )

    try {
      const nowDate = new Date()
      const embed = new MessageEmbed()
        .setTitle('🚪 Log de banimento')
        .setColor('RANDOM')
        .addField(
          '👤 Usuário banido »',
          `\`\`\`diff\n- ${memberBanned.user.tag}\`\`\``,
          true
        )
        .addField(
          '👤 Expulsado por »',
          `\`\`\`yaml\n${message.author.tag}\`\`\``,
          true
        )
        .addField(
          '⏲️ Data de banimento »',
          `\`\`\`yaml\n${new Intl.DateTimeFormat(
            'pt-BR',
            intlOptionsDate
          ).format(nowDate)}\`\`\``,
          false
        )
        .addField('📃 Razão »', `\`\`\`yaml\n${reason}\`\`\``, false)
        .setThumbnail(guildRefresh.iconURL())
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      await memberBanned.ban({ reason })
      await message.reply(
        `Você baniu o usuário \`${memberBanned.user.tag}\` com sucesso!`
      )

      const channel_log_id = db.get(
        `${guildRefresh.id}.log.${this.description.type_log}`
      )

      if (channel_log_id) {
        try {
          const channel_log = guildRefresh.channels.cache.get(channel_log_id)

          if (channel_log.isText()) {
            channel_log.send(embed)
          }
        } catch (error) {
          message.util.reply('Houve erro ao criar o log do banimento.')
        }
      }
    } catch {
      try {
        await guildRefresh.members.ban(memberBanned.id, { reason })
        await message.reply(
          `Você baniu o usuário \`${memberBanned.user.tag}\` com sucesso!`
        )
      } catch (error) {
        return message.reply(`Houve um erro ao banir o usuário: ${error}`)
      }
    }
  }
}

export default BanCommand
