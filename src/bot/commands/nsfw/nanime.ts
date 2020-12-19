import { Command } from "discord-akairo"
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js"
import * as randomAnime from "random-anime"
import { BotClientTypes } from "../../index";

class AnimeNSFWCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('nanime', {
            aliases: ['nanime'],
            category: "🔞 NSFW | nsfw",
            description: {
                content: "Com esse comando você pode gerar uma imagem nsfw de anime.",
                metadata: "Comando para gerar waifu; anime;",
                usage: "[command]",
                examples: [
                    "[command]",
                ],
            },
        })
    }

    async exec(message: Message) {
        if (message.channel.type !== "text")
            return message.util.reply("Você não pode executar um comando nsfw nesse canal.")
        if (!message.channel.nsfw)
            return message.util.reply("O canal não é um nsfw então você não pode executar esse comando aqui.")

        const nsfw = randomAnime.nsfw();
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`Clique [aqui](${nsfw}) para baixar a imagem.`)
            .setImage(nsfw);

        message.util.reply(embed);
    }

}

export default AnimeNSFWCommand
