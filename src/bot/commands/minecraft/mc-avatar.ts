import { Command } from "discord-akairo"
import { MessageEmbed } from "discord.js"
import { Message } from "discord.js"
import getUUID from "../../../utils/getUUID"
import { BotClientTypes } from "../../index"

class McAvatarCommand extends Command {
	client: BotClientTypes
	
	constructor() {
		super("mc-avatar", {
			aliases: ["mc-avatar"],
			category: "814841361983340544 Minecraft | minecraft",
			description: {
				content: "Comando para ver o avatar de um player.",
				metadata: "Comando para visualizar a avatar; player",
				usage: "[command] [nickname]",
				examples: [
					"[command] SMCodes",
				],
			},
			args: [
				{
					id: "nickname",
					type: "string"
				}
			]
		})
	}
	
	async exec(message: Message, { nickname }: { nickname?: string }) {
    const uuid = await getUUID(nickname)
    
    const embed = new MessageEmbed()
      .setTitle(`**Avatar de \`${nickname}\`**`)
      .setColor("RANDOM")
      .setDescription(`Clique [aqui](https://crafatar.com/avatars/${uuid}?size=256&default=c06f89064c8a49119c29ea1dbd1aab82&overlay) para baixar a cabeça do usuário`)
      .setImage(`https://crafatar.com/avatars/${uuid}?size=256&default=c06f89064c8a49119c29ea1dbd1aab82&overlay`)
      .setTimestamp()
      .setFooter(nickname, `https://crafatar.com/avatars/${uuid}?size=256&default=c06f89064c8a49119c29ea1dbd1aab82&overlay`)

    await message.util.reply({embed})
  }
}

export default McAvatarCommand
