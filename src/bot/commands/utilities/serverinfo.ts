import { Message, MessageEmbed } from 'discord.js';
import { Command } from "discord-akairo";
import { BotClientTypes } from "../../index";
import * as db from 'quick.db'

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
                    .setTitle("📃 Informações do servidor")
                    .setDescription(`Essas são as informações sobre o servidor **${message.guild.name}**`)
                    .addField(
                      `\u200B`,
                      `**Nome » ** \`\`\`yaml\n${message.guild.name}\`\`\``,
                      true
                    )
                    .addField(
                      `\u200B`,
                      `**ID » ** \`\`\`yaml\n${message.guild.id}\`\`\``,
                      true
                    )
                    .addField(
                      `\u200B`,
                      `**Membros » ** \`\`\`yaml\n${message.guild.memberCount}\`\`\``,
                      true
                    )
                    .addField(
                      `\u200B`,
                      `**Cargos » ** \`\`\`yaml\n${message.guild.roles.cache.size}\`\`\``,
                      true
                    )
                    .addField(
                      `\u200B`,
                      `**Canais texto/voz » ** \`\`\`yaml\n${
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
                      `**Região » ** \`\`\`yaml\n${
                        message.guild.region
                      }\`\`\``,
                      true
                    )
                    .addField(
                      `\u200B`,
                      `**Criador » ** \`\`\`diff\n- ${message.guild.owner.user.tag}\`\`\``,
                      false
                    )
                    .addField(
                      `\u200B`,
                      `**Cargos » ** \`\`\`ini\n[${roles.array().join(', ')}]\`\`\` \n \u200B`,
                      false
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

        message.util.reply(pages[page]())
    }
}

export default ServerInfoCommand
