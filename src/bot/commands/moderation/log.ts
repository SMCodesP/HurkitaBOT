import * as db from "quick.db"
import { Message } from "discord.js"
import { Command } from "discord-akairo"

class LogCommand extends Command {

    constructor() {
        super("log", {
            aliases: ["log"],
            category: "👮‍♂️ Moderação | mod",
            description: {
                content: "Com esse comando um administrador pode setar um log em um canal.",
                metadata: "Comando para log; setar; set; definir;",
                usage: "[command] [Tipo de log]",
                examples: [
                    "[command] banimentos",
                    "[command] expulcoes"
                ]
            },
            args: [
                {
                    id: "type_log",
                    type: "string",
                },
            ]
        })
    }

    async exec(message: Message, { type_log }: { type_log: string }) {

        if (!type_log)
            return message.util.reply("Você não definiu um tipo de log.")

        const types_log: string[] = db.get('types_log') || []

        if (!types_log.includes(type_log))
            return message.util.reply("Esse tipo de log não existe.")

        db.set(`${message.guild.id}.log.${type_log}`, message.channel.id)

        message.util.reply(`Você definiu o canal ${message.channel} como um canal de log \`${type_log}\``)

    }

}

export default LogCommand