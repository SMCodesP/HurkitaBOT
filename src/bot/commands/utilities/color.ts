import * as db from 'quick.db'
import { Command } from "discord-akairo"
import { Message } from "discord.js"
import { BotClientTypes } from "../../index";
import { Collection } from 'discord.js';
import { Role } from 'discord.js';

class ColorCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('color', {
            aliases: ['color'],
            category: "🛠️ Utilitários | utils",
            description: {
                content: "Com esse comando você pode usar uma cor escolhida.",
                metadata: "Comando para setar color; escolher; buscar cores; cor",
                usage: "[command] [Cor]",
                examples: [
                    "[command] Vermelho",
                    "[command] 🎨 Vermelho",
                    "[command] 782371007318196254",
                    "[command] @🎨 Vermelho"
                ],
            },
            args: [
                {
                    id: "color",
                    match: "content",
                    type: "string"
                }
            ]
        })
    }

    async exec(message: Message, { color }: { color: string }) {

        let colorStatus = db.get(`${message.guild.id}.active_colors`) || 'off'

        if (colorStatus.toLowerCase() === "off")
            return message.util.reply(
                'O sistema de cores está desabilitado nesse servidor.'
            )

        const guildRoles = await message.guild.roles.fetch()
        const roleColor = guildRoles.cache.find((roleCached) => {
            return (roleCached.id === color
                    || roleCached.name === color
                    || (roleCached.name.includes(color) && roleCached.name.includes('🎨'))
                    || roleCached.name.split(' ')[1] === color
                    || !!message.mentions.roles.get(roleCached.id))
        })

        const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX

        if (!roleColor || !db.get(`${message.guild.id}.color_role.${roleColor.id}`))
            return message.util.reply(
                `A cor escolhida não existe, use **\`${prefix}lc\`** para listar todas cores disponíveis.`
            )

        const meMember = message.guild.me

        if (!meMember.hasPermission('MANAGE_ROLES') || roleColor.position >= meMember.roles.highest.position)
            return message.util.reply(
                'Não tenho permissão para dar um cargo de cor para você.'
            )

        try {

            const database = db.fetchAll()
            const {data: { color_role }} = database.find((item) => item.ID === message.guild.id)
            const rolesColors: Collection<string, Role> = new Collection()
        
            Object.values(color_role).forEach((color: {
                id: string;
            }) => {
                rolesColors.set(color.id, message.guild.roles.cache.get(color.id))
            })

            await message.member.roles.remove(rolesColors)
            await message.member.roles.add(roleColor)

            message.util.reply(rolesColors.size === 0
                ? `Você trocou ${rolesColors.size > 1 ? 'as cores' : 'a cor'} ${rolesColors.array().join(', ')} para cor \`${roleColor.name}\` com sucesso!`
                : `Você obteve a cor \`${roleColor.name}\` com sucesso!`)

        } catch (error) {

            message.util.reply('Houve um erro ao obter a cor escolhida')

        }

    }

}

export default ColorCommand
