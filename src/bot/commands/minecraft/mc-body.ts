import { Command } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'
import getUUID from '../../../utils/getUUID'
import { BotClientTypes } from '../../index'

class McBodyCommand extends Command {
  client: BotClientTypes

  constructor() {
    super('mc-body', {
      aliases: ['mc-body'],
      category: '814841361983340544 Minecraft | minecraft',
      description: {
        content: 'Comando para ver a body de um player.',
        metadata: 'Comando para visualizar a body; player',
        usage: '[command] [nickname]',
        examples: ['[command] SMCodes'],
      },
      args: [
        {
          id: 'nickname',
          type: 'string',
        },
      ],
    })
  }

  async exec(message: Message, { nickname }: { nickname?: string }) {
    const uuid = await getUUID(nickname)

    const embed = new MessageEmbed()
      .setTitle(`**Body de \`${nickname}\`**`)
      .setColor('RANDOM')
      .setDescription(
        `Clique [aqui](https://crafatar.com/renders/body/${uuid}?size=256&default=c06f89064c8a49119c29ea1dbd1aab82&overlay) para baixar a body`
      )
      .setImage(
        `https://crafatar.com/renders/body/${uuid}?size=256&default=c06f89064c8a49119c29ea1dbd1aab82&overlay`
      )
      .setTimestamp()
      .setFooter(
        nickname,
        `https://crafatar.com/avatars/${uuid}?size=256&default=c06f89064c8a49119c29ea1dbd1aab82&overlay`
      )

    await message.util.reply({ embed })
  }
}

export default McBodyCommand
