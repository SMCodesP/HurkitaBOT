import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { Command } from "discord-akairo";

import {BotClientTypes} from '../../';
import { Song } from "../../structures/entities/Song";

class Mp3Search extends Command {
    client: BotClientTypes;

    constructor() {
        super("mp3search", {
            aliases: ["mp3search"],
            category: "📻 Mp3 rádio | mp3",
            description: {
                content: "Comando para pesquisar algo como música/podcast!",
                metadata: "Mp3 play; start; musica; music; podcast;",
                usage: "[command] {Página para pesquisar}",
                examples: [
                    "[command] 2",
                ]
            },
            args: [
                {
                    id: "searchQuery",
                    match: "content",
                }
            ]
        })
    }

    async exec(message: Message, {searchQuery, page = null }: {page: string | null;searchQuery: string;}) {

        const tableConvert = {
            1: "1️⃣",
            2: "2⃣",
            3: "3️⃣",
            4: "4️⃣",
            5: "5⃣",
        }

        const {data: responseData} = await this.client.youtube.search.list({
            part: ['snippet'],
            q: searchQuery,
            type: ['video'],
            maxResults: 5,
            pageToken: page
        });
        
        const embedSearch = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`📄 Itens encontrado na pesquisa`)
            .setTimestamp()
            .setFooter(`Copyright © 2020 - ${this.client.user.username}`, this.client.user.displayAvatarURL())

        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            minute: "2-digit",
            hour: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "America/Sao_Paulo"
        }

        if (!responseData.items[0])
            embedSearch.addField(
                "\nNenhum video nessa página de pesquisa.",
                "\u200B"
            )

        responseData.items.forEach((item, index) => {
            const datePublished = new Date(item.snippet.publishedAt)

            embedSearch
                .addField(
                    `🔢 Item »`,
                    tableConvert[index+1],
                    false,
                )
                .addField(
                    `🖊️ Título »`,
                    `\`\`\`yaml\n${item.snippet.title}\`\`\``,
                    false,
                )
                .addField(
                    `⏲️ Publicado »`,
                    `\`\`\`yaml\n${new Intl.DateTimeFormat('pt-BR', options).format(datePublished)}\`\`\``,
                    true,
                )
                .addField(
                    `📈 Publicado por »`,
                    `\`\`\`diff\n- ${item.snippet.channelTitle}\`\`\``,
                    true
                )
                .addField(
                    `📰 Descrição »`,
                    `\`\`\`yaml\n${item.snippet.description}\`\`\`\n \u200B`,
                    false,
                )
        })

        const messageSearch: Message = await message.util.reply(embedSearch)

        await messageSearch.react("1️⃣")
        await messageSearch.react("2⃣")
        await messageSearch.react("3️⃣")
        await messageSearch.react("4️⃣")
        await messageSearch.react("5⃣")
        await messageSearch.react("⬅️")
        await messageSearch.react("➡️")

        const filter = (_: MessageReaction, user: User) => user.id === message.author.id;
        const collectorReaction = messageSearch.createReactionCollector(filter, { time: 60000 * 5 });

        const mp3play = this.handler.modules.get("mp3play")
        
        const functionsReactions = {
            "⬅️": async () => {
                await messageSearch.delete()
                this.exec(message, { searchQuery, page: responseData.prevPageToken })
            },
            "➡️": async () => {
                await messageSearch.delete()
                this.exec(message, { searchQuery, page: responseData.nextPageToken })
            },
        }

        collectorReaction.on("collect", async (reaction) => {
            if (functionsReactions[reaction.emoji.name]) {
                return await functionsReactions[reaction.emoji.name]()
            } else {
                const itemSelect = Number(this.getKeyByValue(tableConvert, reaction.emoji.name)) - 1
                await messageSearch.delete()
                mp3play.exec(message, {
                    searchQuery: responseData.items[itemSelect].snippet.title
                })
            }
        });

    }

    getKeyByValue(object: Object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

}

export default Mp3Search