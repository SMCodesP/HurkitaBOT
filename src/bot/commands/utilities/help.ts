import { Command } from "discord-akairo"
import { User } from "discord.js"
import { MessageReaction } from "discord.js"
import { Message, MessageEmbed } from "discord.js"
import * as db from 'quick.db'
import getPrefix from "../../../utils/getPrefix"
import paginate from "../../../utils/paginate"

class HelpCommand extends Command {

    constructor() {
        super('help', {
            aliases: ['help', 'ajuda', '?'],
            category: '🛠️ Utilitários | utils',
            description: {
                content: "Ajudar a achar comandos úteis para você utilizar!",
                metadata: "Comando de ajudar; ajuda; help; ?; outros comandos; me ajuda; help-me; ajude-me;",
                usage: "[command] {categoria/comando/page}",
                examples: [
                    "[command]",
                    "[command] mod",
                    "[command] clear",
                    "[command] 1"
                ]
            },
            args: [
                {
                    id: "select",
                    default: 1
                }
            ]
        })
    }

    async helpCommand(message: Message, name: string) {
        let nameCommadSelected = this.handler.aliases.get(name)

        if (name[0] === getPrefix(message.guild.id)) {
            nameCommadSelected = this.handler.aliases.get(name.substring(1))
        }

        const commandSelected = this.handler.modules.get(nameCommadSelected)

        if (!nameCommadSelected || !commandSelected)
            throw new Error('Nenhum comando encontrado.')

        const embedHelpOfCommand = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Detalhes do comando \`${nameCommadSelected}\``)
            .setDescription("**Atenção »** Argumentos de comandos que tenham \`[]\` são obrigatórios, com \`{}\` são argumentos opicionais.\n \u200B")
            .addField(
                "Nome »",
                `\`\`\`diff\n- ${commandSelected.id}\`\`\``,
                true
            )
            .addField(
                "Alternativas »",
                `\`\`\`ini\n[${commandSelected.aliases.join(', ')}]\`\`\``,
                true
            )
            .addField(
                "Categoria »",
                `\`\`\`fix\n${commandSelected.categoryID.split('|')[0].trim()}\`\`\``,
                true
            )
            .addField(
                "Descrição »",
                `\`\`\`bash\n# ${commandSelected.description.content}\`\`\``,
                false
            )
            .addField(
                "Modo de usar »",
                `\`\`\`yaml\n${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}${commandSelected.description.usage.replace('[command]', commandSelected.id)}\`\`\``,
                false
            )
            .addField(
                "Exemplos »",
                `\`\`\`yaml\n${commandSelected.description.examples.join("\n")
                    .replace(/\[command\]/g, `${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}` + commandSelected.id)
                    .replace(/\[member\]/g, message.author.username)
                }\`\`\`\n \u200B`
            )
            .setTimestamp()
            .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())

        message.util.reply(embedHelpOfCommand)
    }

    async helpCategory(message: Message, name: string) {
        const categorySelected = this.handler.categories.get(this.handler.categories.findKey((key) => {
            const strignsOfKey = key.id.split('|')
            if (!strignsOfKey[1])
                return false;
            const nameCategory = strignsOfKey[1].trim()

            return (nameCategory === name)
        }))

        if (!categorySelected)
            throw new Error('Nenhuma categoria encontrada.')

        const embedHelpOfCategory = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Lista de comandos da categoria: __${categorySelected.id.split('|')[0].trim()}__`)
            .setDescription(`❗ **Prefix »** \`${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}\`\n📄 **Comandos disponíveis nessa categoria »** \`${categorySelected.size}\`\n📅 **Versão »** \`${process.env.VERSION || "1.0"}\``)
            .setTimestamp()
            .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())

        categorySelected.forEach((command) => {
            embedHelpOfCategory
                .addField(
                    `\u200B`,
                    `**\`${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}${command.description.usage.replace('[command]', command.aliases[0])}\`** - ${command.description.content}`
                )
        })

        message.util.reply(embedHelpOfCategory)
    }

    isNumeric(value: string) {
        return /^-?\d+$/.test(value);
    }

    async exec(message: Message, { select }: { select: string; }) {

        let page: number

        if (select && typeof select === "string" && !this.isNumeric(select)) {
            this.helpCategory(message, select)
                .catch(_ => {
                    this.helpCommand(message, select)
                        .catch(_ => {
                            message.reply(`Não foi possível localizar um comando nem uma categoria com esse nome, utilize \`${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}pesquisar [Alguma palavra chave para encontrar o nome do comando]\``)
                        })
                })

            return;
        } else {
            page = Number(select)
        }

        const countAllCommands = this.handler.modules.size

        const pages = paginate(this.handler.categories.keyArray(), 5)

        const embed = new MessageEmbed()
            .setTitle(`Ajuda da Hurkita${(typeof page === "number") ? ` | Page ${page}` : '.'}`)
            .setColor("RANDOM")
            .setDescription(`❗ **Prefix »** \`${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}\`\n📄 **Comandos disponíveis »** \`${countAllCommands}\`\n📅 **Versão »** \`${process.env.VERSION || "1.0"}\`\n \u200B`)
            .setTimestamp()
            .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())

        const categories: string[] = (typeof page === "number") ? pages[page-1] : this.handler.categories.keyArray()

        if (!categories) {
            embed.addField("A página selecionada não possuí nenhum item disponível.", "\u200B")

            await message.util.reply(embed)
            return;
        }

        categories.forEach(async (categoryKey) => {
            const namesOfSpliting: string[] = categoryKey.split('|')
            const name = namesOfSpliting[0].trim()
            const nameFormatted = namesOfSpliting[1].trim()
            const countCommandsInCategory = this.handler.categories.get(categoryKey)

            embed.addField(
                `${name} \`[${countCommandsInCategory.size} comandos]\``,
                `\`${db.get(`${message.guild.id}.prefix`) || process.env.PREFIX}${this.id} ${nameFormatted}\`\n \u200B`
            )
        })

        const messageHelpEmbed = await message.util.reply(embed)

        for (let indexHelp = 0; indexHelp < categories.length; indexHelp++) {
            const name = categories[indexHelp]
            await messageHelpEmbed.react(name.split(" ")[0])

            const filter = (reaction: MessageReaction, user: User) => user.id === message.author.id && reaction.emoji.name === name.split(" ")[0];
            const collectorReaction = messageHelpEmbed.createReactionCollector(filter, { time: 60000 * 5, max: 1 });

            collectorReaction.on("collect", async (reaction) => {
                await messageHelpEmbed.reactions.removeAll()
                this.helpCategory(message, name.split('|')[1].trim())
            });
        }

        if (typeof page === "number" && (pages[page] || pages[page-2])) {
            if (pages[page]) {
                await messageHelpEmbed.react("➡️")
            } else {
                await messageHelpEmbed.react("⬅️")
            }

            const filter = (reaction: MessageReaction, user: User) => user.id === message.author.id && (reaction.emoji.name === "➡️" || reaction.emoji.name === "⬅️");
            const collectorReaction = messageHelpEmbed.createReactionCollector(filter, { time: 60000 * 5, max: 1 });
            const options = {
                "➡️": async () => {
                    this.exec(message, { select: (page + 1).toString() })
                },
                "⬅️": async () => {
                    this.exec(message, { select: (page - 1).toString() })
                }
            }

            collectorReaction.on("collect", async (reaction) => {
                if (options[reaction.emoji.name]) {
                    await messageHelpEmbed.reactions.removeAll()
                    await options[reaction.emoji.name]()
                }
            });
        }

    }

}

export default HelpCommand
