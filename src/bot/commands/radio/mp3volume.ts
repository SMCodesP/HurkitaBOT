import { Command } from "discord-akairo";
import { MessageReaction } from "discord.js";
import { User } from "discord.js";
import { Message } from "discord.js";

import {BotClientTypes} from "../../";
import getPrefix from "../../../utils/getPrefix";
import validatePermission from "../../../utils/validatePermission";

class Mp3Volume extends Command {
	client: BotClientTypes;

	constructor() {
		super("mp3volume", {
			aliases: ["mp3volume"],
			channel: "guild",
			category: "📻 Mp3 rádio | mp3",
			description: {
				content: "Com esse comando você pode aumentar o volume de uma música mp3!",
				metadata: "Mp3 volume; aumentar;",
				usage: "[command] [Novo volume 1-10]",
				examples: [
					"[command] 3",
				]
			},
			args: [
				{
					id: "newVolume",
					type: "number"
				}
			]
		})
	}

	async exec(message: Message, {newVolume}: { newVolume: number }) {
		if (!validatePermission(message.author, "mp3volume"))
      return message.util.reply("você não tem permissão para aumentar o volume do mp3.")
		if (!message.member.voice.channel)
			return message.util.reply("você não está em um canal de voz!");
		if (!newVolume || !Number(newVolume))
			return message.util.reply(`sintaxe incorreta, utilize o comando dessa forma \`${getPrefix(message.guild.id)}${this.id} [1-10]\`.`)

		const serverQueue = this.client.queueSongs.get(message.guild.id)

		if (!serverQueue)
			return message.util.reply(`não estou com tocando nenhuma música, então não posso pular.`)
		if (newVolume < 1 || newVolume > 10)
			return message.util.reply(`você não pode aumentar o volume maior de 10 ou menor que 1.`)

		if (newVolume > 5) {
			const messageConfirm = await message.util.reply("você realmente deseja aumentar o volume maior que 5?\nUm volume maior que 5 podem prejudicar sua audição, reaga com ✅ para confirmar.")

			await messageConfirm.react("✅")

			const filter = (_: MessageReaction, user: User) => user.id === message.author.id;
			const collectorReaction = messageConfirm.createReactionCollector(filter, { time: 60000 * 5 });

			collectorReaction.on("collect", async (reaction) => {
				if (reaction.emoji.name === "✅") {
					messageConfirm.reactions.removeAll()
					this.modifyVolume(message, newVolume)
				}
			})
		} else {
			this.modifyVolume(message, newVolume)
		}
	}

	modifyVolume(message: Message, newVolume: number) {
		const serverQueue = this.client.queueSongs.get(message.guild.id)

		const oldVolume = serverQueue.volume

		serverQueue.volume = newVolume
		serverQueue.connection.dispatcher.setVolumeLogarithmic(newVolume / 10)

		message.util.reply(
			`você aumentou o volume de \`${oldVolume}\` para \`${newVolume}\`!\n**Volume padrão »** \`${serverQueue.defaultVolume}\``
		)
	}

}

export default Mp3Volume
