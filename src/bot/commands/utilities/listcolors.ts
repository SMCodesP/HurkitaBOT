import * as db from 'quick.db'
import { Command } from "discord-akairo"
import { Message } from "discord.js"
import { BotClientTypes } from "../../index";
import paginate from '../../../utils/paginate';
import { Role } from 'discord.js';
import { MessageReaction } from 'discord.js';
import { User } from 'discord.js';

class ListColorCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('listcolors', {
            aliases: ['listcolors', 'lc'],
            category: "🛠️ Utilitários | utils",
            description: {
                content: "Com esse comando você pode listar todas as cores disponíveis.",
                metadata: "Comando para listar cores; cor; colors; listing",
                usage: "[command]",
                examples: [
                    "[command]",
                ],
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

        let colorStatus = db.get(`${message.guild.id}.active_colors`) || 'off'

        if (colorStatus.toLowerCase() === "off")
            return message.util.reply(
                'O sistema de cores está desabilitado nesse servidor.'
            )

        const guildRoles = await message.guild.roles.fetch()
        const rolesColor = guildRoles.cache.filter((roleCached) => {
            return (roleCached.name.split(' ')[0] === "🎨")
        })

        const roles: Array<Array<Role>> = paginate(rolesColor.array(), 5)
        let rolesName: Array<string> = []
        if (roles[page-1].length !== 0) {
            rolesName = roles[page-1].map((role) => role.name.trim())
        }

        const messageReply = await message.util.reply(`**Página ${page} | Lista de cores disponíveis »**\n\n${(roles[page-1].length === 0)
                ? 'Nenhuma cor disponível até o momento.'
                : `\`${rolesName.join('\n')}\``}
        `)

        const utilOption = {
            '➡️': async () => {
                this.exec(message, {page: page+1})
            },
            '⬅️': async () => {
                this.exec(message, {page: page-1})
            }
        }

        if (roles[page])
            await messageReply.react('➡️')
        if (roles[page-2])
            await messageReply.react('⬅️')

        if (roles[page-2] || roles[page]) {
            const filter = (_: MessageReaction, user: User) => user.id === message.author.id
            const collectorReaction = messageReply.createReactionCollector(filter, { time: 60000 * 5, max: 1 })

            collectorReaction.on("collect", async (reaction) => {
                if (utilOption[reaction.emoji.name]) {
                    await messageReply.delete()
                    utilOption[reaction.emoji.name]()
                }
		    })
        }

    }

}

export default ListColorCommand