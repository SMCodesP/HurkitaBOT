import { Command } from 'discord-akairo'
import { GuildMember } from 'discord.js'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'
import { BotClientTypes } from '../../index'

class AvatarCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('avatar', {
      aliases: ['avatar'],
      category: '🛠️ Utilitários | utils',
      description: {
        content: 'Com esse comando você pode ver o avatar de um membro.',
        metadata: 'Comando para ver avatar; membros',
        usage: '[command] {User id/@User}',
        examples: [
          '[command]',
          '[command] 520311747098312725',
          '[command] @SMCodes#6874',
        ],
      },
      args: [
        {
          id: 'memberMention',
          type: async (message: Message, member: GuildMember | string) => {
            if (message.mentions.members.first())
              return message.mentions.members.first()
            if (typeof member === 'string') {
              try {
                return (
                  (await message.guild.members.fetch()).get(member) ||
                  message.member
                )
              } catch (error) {
                return message.member
              }
            }
            return message.member
          },
        },
      ],
    })
  }

  async exec(
    message: Message,
    { memberMention }: { memberMention: GuildMember }
  ) {
    try {
      const urlAvatar = memberMention.user.displayAvatarURL({
        size: 4096,
        dynamic: true,
      })

      const embedAvatar = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`${memberMention.user.tag} avatar`)
        .setDescription(`Clique [aqui](${urlAvatar}) para baixar a imagem.`)
        .setImage(urlAvatar)
        .setTimestamp()
        .setFooter(
          `Copyright © 2021 - ${this.client.user.username}`,
          this.client.user.displayAvatarURL()
        )

      await message.util.reply(embedAvatar)
    } catch (error) {
      await message.util.reply('Houve um erro ao enviar o avatar do usuário')
    }
  }
}

export default AvatarCommand
