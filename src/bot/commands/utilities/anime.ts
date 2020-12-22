import { Command } from "discord-akairo"
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js"
import * as db from "quick.db"
import axios from "axios";
import { BotClientTypes } from "../../index";

const animeTypes = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "smile", "wave", "highfive", "handhold", "nom", "bite", "glomp", "kill", "slap", "happy", "wink", "poke", "dance", "cringe", "blush"]

class AnimeCommand extends Command {
    client: BotClientTypes

    constructor() {
        super('anime', {
            aliases: ['anime'],
            category: "🛠️ Utilitários | utils",
            description: {
                content: "Com esse comando você pode ganhar uma imagem de anime.",
                metadata: "Comando para gerar waifu; anime;",
                usage: "[command] {tipo/list}",
                examples: [
                    "[command] waifu",
                    "[command] list",
                ],
            },
            args: [
                {
                    id: "type",
                    type: "string"
                }
            ]
        })
    }

    async exec(message: Message, { type }: { type: string }) {
        const prefix = db.get(`${message.guild.id}.prefix`) || process.env.PREFIX
        if (!type) {
            type = animeTypes[Math.floor(Math.random() * animeTypes.length)]
        }

        if (type === "list") {
            const embedTypes = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Lista de tipos de imagens")
                .setTimestamp()
                .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())
            
            animeTypes.forEach((typeAnime) => {
                embedTypes.addField(`${typeAnime}`, `\`\`\`yaml\n${prefix}${this.id} ${typeAnime}\`\`\``, true)
            })

            message.util.reply(embedTypes)
            return;
        }

        if (!animeTypes.includes(type))
            return message.util.reply(`Esse tipo de imagem não tenho.\nUse \`${prefix}${this.id} list\` para listar todas categorias.`)
        
        
        try {
            const image = await axios.get(`https://waifu.pics/api/sfw/${type}`)

            if (!image.data.url)
                return message.util.reply(
                    `Não houve nenhuma imagem encontrada de ${type}.`
                )
    
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`Clique [aqui](${image.data.url}) para baixar a imagem.`)
                .setImage(image.data.url)
                .setTimestamp()
                .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL());
    
            message.util.reply(embed);
        } catch (error) {
            console.bot(error)
            message.util.reply("Houve um erro ao buscar uma imagem, tente novamente mais tarde.")
        }
    }

}

export default AnimeCommand
