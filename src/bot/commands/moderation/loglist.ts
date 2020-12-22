import * as db from "quick.db"
import { Message } from "discord.js"
import { Command } from "discord-akairo"
import {MessageEmbed} from "discord.js"

class LogCommand extends Command {

  constructor() {
    super("loglist", {
      aliases: ["loglist"],
      category: "👮‍♂️ Moderação | mod",
      description: {
        content: "Com esse comando um administrador pode listar todas os tipos de logs disponíveis.",
        metadata: "Comando para logs; disponíveis; list; listar;",
        usage: "[command] {Página de listagem de log}",
        examples: [
          "[command] 1",
          "[command] 2"
        ]
      },
      args: [
        {
          id: "page",
          type: "number",
          default: 1,
        }
      ]
    })
  }

  async exec(message: Message, { page }: { page: number }) {

    if (!message.member.hasPermission("MANAGE_CHANNELS"))
      return message.util.reply("Você não tem permissão para executar esse comando!")

    const types_log: string[] = db.get('types_log') || []

    const embedListLogs = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Listagem de tipos de logs disponíveis")
      .setTimestamp()
      .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())

    types_log.forEach((log: string) => {
      console.bot(log)
    })
  }

}

export default LogCommand
