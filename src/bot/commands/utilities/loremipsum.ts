import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { loremIpsum } from "lorem-ipsum";
import { BotClientTypes } from "../../index";

const types = {
    'paragrafos': 'paragraphs',
    'frases': 'sentences',
    'palavras': 'words',
}

class LoremIpsumCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('loremipsum', {
            aliases: ['loremipsum'],
            category: "🛠️ Utilitários | utils",
            cooldown: 20000,
            description: {
                content: "Com esse comando você pode ver a minha estabilidade diante o meu servidor e o discord.",
                metadata: "Comando para ping estabilidade",
                usage: "[command] {Quantidade de parágrafos/frases/palávras} {paragrafos/frases/palavras}",
                examples: [
                    "[command] 2 paragrafos",
                    "[command] 5 frases",
                    "[command] 25 palavras",
                ],
            },
            args: [
                {
                    id: "quantity",
                    type: "number",
                    default: 1
                },
                {
                    id: "type",
                    type: "string",
                    default: "paragrafos"
                }
            ]
        })
    }

    async exec(message: Message, {
        quantity,
        type
    }: { quantity: number; type: string }) {
        
        if (!types[type])
            return message.util.reply("Esse tipo de quantidade não existe.")


        try {
            const loremIpsumText = loremIpsum({
                count: quantity,
                format: "plain",
                units: types[type]
            })

            const embedLoremIpsum = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Texto Lorem Ipsum gerado.")
                .setDescription(loremIpsumText)
                .setTimestamp()
                .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL());
    
            message.util.reply(embedLoremIpsum)
        } catch (error) {
            console.log(error)
            message.util.reply("Houve um erro ao gerar o Lorem Ipsum, por favor tente novamente mais tarde.")
        }

    }

}

export default LoremIpsumCommand
