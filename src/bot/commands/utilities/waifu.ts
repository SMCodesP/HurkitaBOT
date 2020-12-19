import { Command } from "discord-akairo"
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js"
import * as randomAnime from "random-anime"
import { BotClientTypes } from "../../index";

class WaifuCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('waifu', {
            aliases: ['waifu'],
            category: "🛠️ Utilitários | utils",
            description: {
                content: "Com esse comando você pode ganhar sua waifu.",
                metadata: "Comando para gerar waifu; anime;",
                usage: "[command]",
                examples: [
                    "[command]",
                ],
            },
        })
    }

    async exec(message: Message) {
        const anime = randomAnime.anime();
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`Clique [aqui](${anime}) para baixar a imagem.`)
            .setImage(anime);

        message.util.reply(embed);
    }

}

export default WaifuCommand
