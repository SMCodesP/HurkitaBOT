import { Command } from "discord-akairo";
import * as translatte from "translatte";
import { Message, MessageEmbed } from "discord.js";
import { BotClientTypes } from "../../index";

class TranslategCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('translate', {
            aliases: ['translate', 'traduzir'],
            category: "🛠️ Utilitários | utils",
            cooldown: 15000,
            description: {
                content: "Com esse comando você pode traduzir um texto a uma linguagem específica.",
                metadata: "Comando para traduzir linguagens languages",
                usage: "[command] [Linguagem para ser traduzida] [Texto]",
                examples: [
                    "[command] pt Hello, [member]!",
                ],
            },
            args: [
                {
                    id: "language",
                    type: "string"
                },
                {
                    id: "text",
                    type: "string",
                    match: "content"
                }
            ]
        })
    }

    async exec(message: Message, { language, text }: { language: string; text: string }) {

        const embedLoading = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Carregando...")
            .setTimestamp()
            .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL());

        await message.util.reply(embedLoading)

        try {
            const textTranslate = text.split(" ")
            textTranslate.shift()
            console.log(textTranslate)
            const textTranslated = await translatte(textTranslate.join(" "), {
                to: language
            })

            console.log(textTranslated)

            const embedTranslated = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Texto traduzido.")
                .setDescription(textTranslated.text)
                .setTimestamp()
                .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL());

            await message.util.reply(embedTranslated)
        } catch (error) {
            console.log(error)
            await message.util.reply("Houve um erro ao traduzir o texto digitado, tente novamente mais tarde.")
        }
    }

}

export default TranslategCommand
