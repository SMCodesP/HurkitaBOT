import * as db from 'quick.db'
import { Command } from "discord-akairo"
import { Message } from "discord.js"
import { BotClientTypes } from "../../index";

class RefreshColorRolesCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('refreshcolors', {
            aliases: ['refreshcolors', 'atualizarcores', 'ac', 'rc'],
            category: "🛠️ Utilitários | utils",
            description: {
                content: "Atualizar cargos de cores.",
                metadata: "Refresh roles of colors; atualizar cargos; de; cores",
                usage: "[command] [@Cargo_cor/ID_Cargo_cor]",
                examples: [
                    "[command] @Purple",
                    "[command] 520311747098312725"
                ],
            }
        })
    }

    async exec(message: Message) {
        if (!message.member.hasPermission("MANAGE_ROLES"))
            return message.util.reply(
                "Você não tem permissão para executar esse comando."
            )

        const rolesColor = message.guild.roles.cache.filter(
            (role) => (role.name.split(' ')[0] === "🎨")
        )

        rolesColor.forEach((role) => {
            console.bot(role)
            db.delete(`${message.guild.id}.color_role.${role.id}`)
            db.set(`${message.guild.id}.color_role.${role.id}`, role)
        });

        message.util.reply(
            'A lista de cargos de cores foram atualizados.'
        )
    }

}

export default RefreshColorRolesCommand
