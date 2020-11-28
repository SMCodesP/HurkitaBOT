import { Message, MessageEmbed } from 'discord.js';
import { Command } from "discord-akairo";
import { BotClientTypes } from "../../index";
import flagsEmojis from "../../../utils/flagsEmojis";
import * as db from "quick.db";
import { MessageReaction } from 'discord.js';
import { User } from 'discord.js';

class ServerInfoCommand extends Command {
	client: BotClientTypes;

	constructor() {
		super("serverinfo", {
			aliases: ["serverinfo"],
			category: '🛠️ Utilitários | utils',
			description: {
				content: "Esse comando você pode saber informações sobre esse servidor.",
				metadata: "Comando informações servidores; servidor; information;",
				usage: "[command]",
				examples: [
					"[command]",
				],
			},
		})
	}

	async exec(message: Message, { page = 0 }: { page: number }) {
		const pages = {
			0: () => {
				const roles = message.guild.roles.cache.mapValues((role) => role.name);
				
				return new MessageEmbed()
					.setColor("RANDOM")
					.setThumbnail(message.guild.iconURL())
					.setTitle(`📃 Informações do servidor | ${page+1}`)
					.setDescription(`Essas são as informações sobre o servidor **${message.guild.name}**`)
					.addField(
						`\u200B`,
						`🔤 **Nome » ** \`\`\`yaml\n${message.guild.name}\`\`\``,
						true
					)
					.addField(
						`\u200B`,
						`🆔 **ID » ** \`\`\`yaml\n${message.guild.id}\`\`\``,
						true
					)
					.addField(
						`\u200B`,
						`👨‍👧‍👦 **Membros » ** \`\`\`yaml\n${message.guild.memberCount}\`\`\``,
						true
					)
					.addField(
						`\u200B`,
						`🛡️ **Cargos » ** \`\`\`yaml\n${message.guild.roles.cache.size}\`\`\``,
						true
					)
					.addField(
						`\u200B`,
						`📢 **Canais texto/voz » ** \`\`\`yaml\n${
							message.guild.channels.cache.filter(
								(channelCount) => channelCount.type === 'text'
							).size
						}/${
							message.guild.channels.cache.filter(
								(channelCount) => channelCount.type === 'voice'
							).size
						}\`\`\``,
						true
					)
					.addField(
						`\u200B`,
						`${this.client.emojis.cache.get(flagsEmojis[message.guild.region]) || "🏳️"} **Região » ** \`\`\`yaml\n${
							message.guild.region
						}\`\`\``,
						true
					)
					.addField(
						`\u200B`,
						`👤 **Criador(a) » ** \`\`\`diff\n- ${message.guild.owner.user.tag}\`\`\``,
						false
					)
					.addField(
						`\u200B`,
						`<:586789843015565332:780881891032039464> **Cargos » ** \`\`\`ini\n[${roles.array().join(', ')}]\`\`\` \n \u200B`,
						false
					)
					.setTimestamp()
					.setFooter(
						`Copyright © 2020 ${this.client.user.username}`,
						this.client.user.avatarURL()
					);
			},
			1: () => {
				return new MessageEmbed()
					.setColor("RANDOM")
					.setThumbnail(message.guild.iconURL())
					.setTitle("📃 Informações do servidor")
					.setDescription(`Essas são as informações sobre o servidor **${message.guild.name}**`)
					.addField(
						`\u200B`,
						`**Prefix »** \`\`\`yaml\n${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}\`\`\``,
						true
					)
					.addField(
						`\u200B`,
						`**Emojis »** \`\`\`yaml\n${message.guild.emojis.cache.size}\`\`\``,
						true
					)
					.setTimestamp()
					.setFooter(
						`Copyright © 2020 ${this.client.user.username}`,
						this.client.user.avatarURL()
					);
			}
		}

		if (!pages[page])
			return message.util.reply(`página de inormação não encontrada.`)

		const messageInfo = await message.util.reply(pages[page]())

		if (pages[page+1]) {
			await messageInfo.react("➡️")
		}
		if (pages[page-1]) {
			await messageInfo.react("⬅️")
		}
		const filter = (_: MessageReaction, user: User) => user.id === message.author.id;
		const collectorReaction = messageInfo.createReactionCollector(filter, { time: 60000 * 5 });

		const functionsReactions = {
				"⬅️": async () => {
					await messageInfo.reactions.removeAll()
					this.exec(message, { page: page-1 })
				},
				"➡️": async () => {
					await messageInfo.reactions.removeAll()
					this.exec(message, { page: page+1 })
				},
		}

		collectorReaction.on("collect", async (reaction) => {
				if (functionsReactions[reaction.emoji.name]) {
					return await functionsReactions[reaction.emoji.name]()
				}
		});
	}
}

export default ServerInfoCommand
