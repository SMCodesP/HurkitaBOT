import { RoleBot } from './../../structures/entities/RoleBot';
import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import * as db from "quick.db";
import validatePermission from '../../../utils/validatePermission';
import { UserBot } from '../../structures/entities/UserBot';

class SetBotRole extends Command {

    constructor() {
        super("setbotrole", {
            aliases: ["setbotrole"],
            category: "👷 Funcionários | workers",
            description: {
                content: "Setar cargos dentro do bot!",
                metadata: "Set role; setar permissão; dar cargo; role; cargo;",
                usage: "[command] [role] [@user/userID]",
                examples: [
                    "[command] owner @SMCodes#4207",
                ],
            },
            args: [
                {
                    id: "rolename",
                    type: "string",
                },
                {
                    id: "memberMention",
                    default: (message: Message): GuildMember => message.guild.members.cache.get(message.author.id),
                    type: async (message: Message, member: GuildMember | string): Promise<GuildMember> => {
                        if (message.mentions.members.first())
                            return message.mentions.members.first()
                        return (typeof member == "string") ? message.guild.members.cache.get(member) : null
                    }
                }
            ],
        })
    }

    exec(message: Message, {rolename, memberMention}: {rolename: string, memberMention: GuildMember}) {

        if (!validatePermission(message.author, "setbotrole"))
            return message.util.reply("você não tem permissão para setar um cargo a um usuário.")
        if (message.author.id === memberMention.user.id)
            return message.util.reply("você não tem permissão para setar um cargo a si mesmo.")

        const role: RoleBot = db.get(`roles.${rolename}`)
        if (!role)
            return message.util.reply(`o cargo digitado não existe dentro do meu sistema, use \`${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}listarcargos\``)

        const userBot: UserBot = db.get(`users.${memberMention.user.id}`)

        if (!userBot) {
            db.set(`users.${memberMention.user.id}`, {
                id: memberMention.user.id,
                role: role,
            })
        } else {
            db.set(`users.${memberMention.user.id}.role`, role)
        }

        message.util.reply(`você setou o cargo \`${role.name}\` para o usuário ${memberMention}.`)

    }

}

export default SetBotRole