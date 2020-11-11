import { Message, GuildMember } from 'discord.js'
import { Argument, Command } from "discord-akairo"

class BanCommand extends Command {

    constructor() {
        super("ban", {
            aliases: ["ban", "banir"],
            category: "👮‍♂️ Moderação | mod",
            description: {
                content: "Com esse comando um admnistrador pode banir um membro do servidor.",
                usage: "[command] [@member/memberID] {razão}",
                examples: [
                    "[command] 360247173356584960 Spam no chat",
                    "[command] @SMCodes#4207"
                ]
            },
            args: [
                {
                    id: "memberBanned",
                    type: async (message: Message, member: GuildMember | string) => {
                        if (message.mentions.members.first())
                            return message.mentions.members.first()
                        return await message.guild.members.fetch(member)
                    }
                },
                {
                    id: "reason",
                    type: "string",
                    default: "Nenhuma razão mencionada."
                },
            ]
        })
    }

    async exec(message: Message, { memberBanned, reason }: { memberBanned: GuildMember, reason: string }) {

        const authorMember = message.member,
            owner = message.guild.owner,
            meMember = message.guild.me

        if (!memberBanned)
            return message.reply("Por favor mencione um membro válido para ser banido.")
        if (!meMember.hasPermission('BAN_MEMBERS'))
            return message.reply("Eu não tenho permissão para banir membros.")
        if (!authorMember.hasPermission('BAN_MEMBERS') && owner.id !== authorMember.id)
            return message.reply("Você não tem permissão de banir membros.")
        if (authorMember.id === memberBanned.id)
            return message.reply("Você não pode banir a si mesmo.")
        if (memberBanned.id === owner.id)
            return message.reply("Você não pode banir o rei.")
        if (memberBanned.roles.highest.position >= meMember.roles.highest.position)
            return message.reply("Eu não posso banir um usuário que está acima do meu cargo.")
        if (memberBanned.roles.highest.position >= authorMember.roles.highest.position)
            return message.reply("Você não tem permissão para banir um membro que tenha um cargo mais alto que você.")
        if (!memberBanned.bannable)
            return message.reply(`O usuário ${memberBanned}, não pode ser banido por algum motivo.`)

        try {

            await memberBanned.ban({ reason })
            await message.reply(`Você baniu o usuário \`${memberBanned.user.tag}\` com sucesso!`)

        } catch {
            try {
                await message.guild.members.ban(memberBanned.id, { reason })
                await message.reply(`Você baniu o usuário \`${memberBanned.user.tag}\` com sucesso!`)
            } catch (error) {
                return message.reply(`Houve um erro ao banir o usuário: ${error}`)
            }
        }
        

    }

}

export default BanCommand