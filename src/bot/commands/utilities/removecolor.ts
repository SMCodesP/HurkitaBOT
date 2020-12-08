import * as db from 'quick.db'
import { Command } from "discord-akairo"
import { Message } from "discord.js"
import { BotClientTypes } from "../../index";

class RemoveColorCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('removecolor', {
            aliases: ['removecolor'],
            category: "🛠️ Utilitários | utils",
            description: {
                content: "Remover um cargo de cor no sistema de cores.",
                metadata: "Comando para remover; cor; cores; color; delete;",
                usage: "[command] [@Cargo_cor/ID_Cargo_cor]",
                examples: [
                    "[command] @Purple",
                    "[command] 520311747098312725"
                ],
            },
            args: [
                {
                    id: "role",
                    type: "string"
                }
            ]
        })
    }

    async exec(message: Message, { role }: { role: string }) {

        if (!message.member.hasPermission("MANAGE_ROLES"))
            return message.util.reply(
                "Você não tem permissão para executar esse comando."
            )

        const roleMention = message.mentions.roles.first() || message.guild.roles.cache.get(role);
        let roleID: string;

        if (!roleMention) {
            return message.util.reply(
                'Nenhum cargo encontrado com o conteúdo digitado no comando.'
            )
        } else {
            if (!db.get(`${message.guild.id}.color_role.${role}`)) {
                return message.util.reply(
                    'Nenhum cargo encontrado com o conteúdo digitado no comando.'
                )
            }
            roleID = role
        }

        db.delete(`${message.guild.id}.color_role.${roleID}`)

        message.util.reply(
            'O cargo foi retirado como um cargo de cor.'
        )

    }

}

export default RemoveColorCommand
