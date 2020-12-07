import * as db from 'quick.db'
import { Command } from "discord-akairo"
import { Message } from "discord.js"
import { BotClientTypes } from "../../index";

class SetColorCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('setcolor', {
            aliases: ['setcolor'],
            category: "🔧 Configurações | config",
            description: {
                content: "Comando para setar se o sistema de cores está habilitado.",
                metadata: "Comando para setar color; habilitar; desabilitar; cor",
                usage: "[command] [off/on]",
                examples: [
                    "[command] on",
                    "[command] off",
                ],
            },
            args: [
                {
                    id: "status",
                    type: "string"
                }
            ]
        })
    }

    async exec(message: Message, { status }: { status: string }) {
        if (!message.member.hasPermission("MANAGE_ROLES"))
            return message.util.reply(
                "Você não tem permissão para executar esse comando."
            )

        const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX

        if (!status || (status.toLowerCase() !== "on" && status.toLowerCase() !== "off"))
            return message.util.reply(
                `Você digitou um status inválido, você deve usar o comando dessa maneira **${prefix}${this.id} \`on/off\`**`
            )

        status = status.toLowerCase()
        let oldStatus = db.get(`${message.guild.id}.active_colors`) || 'off'
        oldStatus = oldStatus.toLowerCase()

        if (status === oldStatus)
            return message.util.reply(
                `Você digitou o mesmo status de cores que já tinha anteriormente, ou seja continua ${oldStatus}.`
            )

        db.set(`${message.guild.id}.active_colors`, status)

        if (status === 'on') {
            message.util.reply(
                `Você setou o status de cores de \`${oldStatus}\` para \`${status}\`.\n**1.** Para adicionar um cargo na lista de cores crie um cargo com o emoji 🎨 no primeiro caractere do nome, para a identificação automática. **Ex:** \`🎨 Vermelho\`\n**•** Ou use **\`${prefix}setcolorrole\`**\`@cargo\` para uma identificação manual.\n\n**2.** Para saber todas as cores criadas use \`${prefix}lc\`.\n**3.** Para obter uma cor use **\`${prefix}color\`**\`[Nome da cor/ID do cargo da cor/@cargo]\`.\n**Exemplos »**
	**•** **\`${prefix}color\`**\`Vermelho\`
	**•** **\`${prefix}color\`**\`🎨 Vermelho\`
	**•** **\`${prefix}color\`**\`782371007318196254\`
	**•** **\`${prefix}color\`**\`@🎨 Vermelho\`
                `
            )
        } else {
            message.util.reply(
                `Você setou o status de cores de \`${oldStatus}\` para \`${status}\`.`
            )
        }

    }

}

export default SetColorCommand
