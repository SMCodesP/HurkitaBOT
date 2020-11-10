import * as db from 'quick.db'
import { Command } from "discord-akairo"
import { Message } from "discord.js"
import { BotClientTypes } from "../../index";

class PrefixCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('prefix', {
            aliases: ['prefix'],
            category: "🔧 Configurações | config",
            description: {
                content: "Com esse comando você pode trocar o prefixo em um servidor específico.",
                usage: "[command] {Novo prefixo}",
            },
            args: [
                {
                    id: "prefix",
                    default: process.env.PREFIX
                }
            ]
        })
    }

    async exec(message: Message, { prefix }) {
        const oldPrefix = db.get(`${message.guild.id}.prefix`)

        if (oldPrefix === prefix)
            return message.reply("O prefixo especificado é o mesmo do atual.")

        db.set(`${message.guild.id}.prefix`, prefix)
        return message.reply(`Prefixo trocado de \`${oldPrefix}\` para \`${prefix}\``);
    }

}

export default PrefixCommand
