import { Command } from "discord-akairo";
import { Message, GuildMember, MessageEmbed } from "discord.js";
import * as cpuStat from 'cpu-stat';
import { BotClientTypes } from "../../index";

class InfoCommand extends Command {
  client: BotClientTypes;

  constructor() {
    super('info', {
      aliases: ['info'],
      category: "🛠️ Utilitários | utils",
      description: {
        content: "Com esse comando você pode ver o meu status.",
        metadata: "Comando para ping estabilidade",
        usage: "[command]",
        examples: [
          "[command]",
        ],
      },
    })
  }

  async exec(message: Message) {
    const countAllCommands = this.handler.modules.size;
    cpuStat.usagePercent((err, percent, seconds) => {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Informações sobre a ${this.client.user.username}`)
        .addField("> 📁 Categorias disponíveis", `\`\`\`yaml\n${this.handler.categories.size}\`\`\``, true)
        .addField("> 📂 Comandos disponíveis", `\`\`\`yaml\n${countAllCommands}\`\`\``, true)
        .addField("> 📊 **Uso da CPU**", `${percent.toFixed(2)}%`, false)
        .setTimestamp()
        .setFooter(
          `Copyright © 2020 ${this.client.user.username}`,
          this.client.user.avatarURL()
        );

      message.util.reply(embed);
    })
  }
}

export default InfoCommand
