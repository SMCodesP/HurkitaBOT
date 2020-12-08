import * as db from 'quick.db'
import { Command } from "discord-akairo"
import { Message } from "discord.js"
import { BotClientTypes } from "../../index";

class AddColorCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('addcolor', {
            aliases: ['addcolor'],
            category: "🛠️ Utilitários | utils",
            description: {
                content: "Adicionar um cargo de cor no sistema de cores.",
                metadata: "Comando para adicionar; cor; cores; color;",
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
            
        const roleMention = message.mentions.roles.first() || message.guild.roles.cache.get(role)
        const meMember = message.guild.me

        if (!roleMention)
            return message.util.reply(
                'Nenhum cargo encontrado com o conteúdo digitado no comando.'
            )

        if (roleMention.position >= meMember.roles.highest.position)
            return message.util.reply(
                'Não tenho permissão para dar esse cargo a um membro.'
            )

        db.set(`${message.guild.id}.color_role.${roleMention.id}`, roleMention)

        message.util.reply(
            'O cargo foi adicionado como um cargo de cor com sucesso!'
        )

    }

}

export default AddColorCommand
