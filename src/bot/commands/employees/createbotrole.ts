import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { v4 as uuid } from "uuid";
import * as db from "quick.db";
import { RoleBot } from './../../structures/entities/RoleBot';
import validatePermission from "../../../utils/validatePermission";

class CreateBotRole extends Command {

    constructor() {
        super("createbotrole", {
            aliases: ["createbotrole"],
            category: "👷 Funcionários | workers",
            description: {
                content: "Criar um cargo dentro do bot!",
                metadata: "Create role; criar cargo; cargo; role;",
                usage: "[command] [nome do cargo] [comandos permitidos]",
                examples: [
                    "[command] owner *",
                ]
            },
            args: [
                {
                    id: "rolename",
                    type: "string",
                },
                {
                    id: "permissions",
                    type: "text",
                    prompt: {
                        start: (message: Message) => `${message.author}, **Digite as permissões para o cargo.**`,
                        retry: "**Tente novamente digitar as permissões do cargo.**",
                    }
                }
            ]
        })
    }

    exec(message: Message, {rolename, permissions}: { rolename: string, permissions: string }) {

        if (!validatePermission(message.author, "createbotrole"))
            return message.util.reply("você não tem permissão para criar um cargo.")
        if (!rolename)
            return message.util.reply(`por favor você tem que digitar o nome do cargo no comando, dessa forma \`${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}createbotrole [nome do cargo]\`.`)

        if (db.get(`roles.${rolename}`))
            return message.util.reply("você não criar um cargo com o mesmo nome de outro.")

        const permissionsList = permissions.split(" ")
        const role: RoleBot = {
            id: uuid(),
            name: rolename,
            permissions: permissionsList,
        }

        db.set(`roles.${role.name}`, role)

        const embedRole = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🛠️ Criação de cargo")
            .addFields([
                {
                    name: "**Nome »**",
                    value: `\`\`\`diff\n- ${rolename}\`\`\``,
                    inline: true
                },
                {
                    name: "**Criador »**",
                    value: `\`\`\`yaml\n${message.author.tag}\`\`\``,
                    inline: true
                },
                {
                    name: "**Permissões »**",
                    value: `\`\`\`ini\n[${permissionsList.join(", ")}]\`\`\``
                },
                {
                    name: "**Cargo ID »**",
                    value: `\`\`\`yaml\n${role.id}\`\`\``
                }
            ])
            .setTimestamp()
            .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())
        
        message.util.reply(embedRole)
    }

}

export default CreateBotRole