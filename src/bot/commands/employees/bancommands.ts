import { Message } from "discord.js";
import { Command } from "discord-akairo";
import validatePermission from "../../../utils/validatePermission";
import { GuildMember } from "discord.js";
import * as db from "quick.db"

import getPrefix from "../../../utils/getPrefix";

class BanCommands extends Command {

    constructor() {
        super("bancommands", {
            aliases: ["bancommands"],
            category: "👷 Funcionários | workers",
            description: {
                content: "Banir um usuário de usar meus comandos!",
                metadata: "Comando para banir nos meus sistemas; banir; ban; remove;",
                usage: "[command] [@user/userID]",
                examples: [
                    "[command] @SMCodes#4207",
                ]
            },
            args: [
                {
                    id: "memberMention",
                    type: async (message: Message, member: GuildMember | string): Promise<GuildMember> => {
                        if (message.mentions.members.first())
                            return message.mentions.members.first()
                        return (typeof member == "string") ? message.guild.members.cache.get(member) : null
                    }
                }
            ]
        })
    }

    exec(message: Message, { memberMention }: { memberMention: GuildMember | null }) {

        if (!validatePermission(message.author, "bancommands"))
            return message.util.reply("você não tem permissão para banir um usuário.")

        if (!memberMention)
            return message.util.reply(
                `sintaxe incorreta, use dessa forma \`${getPrefix(message.guild.id)}${this.description.usage.replace(/\[command\]/g, this.id)}\``
            )
        if (memberMention.user.id === message.author.id)
            return message.util.reply(
                `você não pode banir a si mesmo.`
            )
        
        if (db.get(`banned.${memberMention.user.id}`))
            return message.util.reply(
                `o usuário mencionado já está banido.`
            )

        if (validatePermission(memberMention.user, "*"))
            return message.util.reply(
                `você nao pode banir um usuário que tem permissão master.`
            )

        db.set(`banned.${memberMention.user.id}`, true)

        message.util.reply(
            `você baniu o usuário \`${memberMention.user.tag}\` com sucesso!`
        )
        
    }

}

export default BanCommands