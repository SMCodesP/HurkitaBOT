import { Message } from "discord.js";
import { Command } from "discord-akairo";

import {BotClientTypes} from '../../';
import { QueueItem } from "../../structures/entities/QueueItem";
import { Song } from "../../structures/entities/Song";
import getPrefix from "../../../utils/getPrefix";
import play from "../../../utils/play";

class Mp3Play extends Command {
    client: BotClientTypes;

    constructor() {
        super("mp3play", {
            aliases: ["mp3play"],
            category: "📻 Mp3 rádio | mp3",
            description: {
                content: "Comando para escutar uma música/podcast!",
                metadata: "Mp3 play; start; musica; music; podcast;",
                usage: "[command] [Texto para pesquisa de música/podcast]",
                examples: [
                    "[command] podcast discord",
                ]
            },
            args: [
                {
                    id: "searchQuery",
                    match: "content"
                }
            ]
        })
    }

    async exec(message: Message, {searchQuery}: {searchQuery: string}) {
        if (!searchQuery)
            return message.util.reply(
                `syntax incorreta, você deve usar o comando dessa forma \`${getPrefix(message.guild.id)}${this.id} [Texto de pesquisa]\`.`
            )

        const voiceChannel = message.member.voice.channel;
        
        if (!voiceChannel)
            return message.util.reply(
                `você não está conectado em um canal de voz.`
            )
        const permissionsOfVoiceChannel = voiceChannel.permissionsFor(message.client.user);

        if (!permissionsOfVoiceChannel.has("CONNECT") || !permissionsOfVoiceChannel.has("SPEAK"))
            return message.util.reply(
                `não tenho permissão para tocar música nesse canal de voz.`
            )
        
        try {
            const {data: responseData} = await this.client.youtube.search.list({
                part: ['snippet'],
                q: searchQuery,
                type: ['video'],
                maxResults: 1
            });

            if (!responseData.items[0])
                return message.util.reply(
                    `nenhum conteúdo encontrado com o texto digitado.`
                );

            const videoLink = `https://www.youtube.com/watch?v=${responseData.items[0].id.videoId}`;
            
            const song: Song = {
                title: responseData.items[0].snippet.title,
                url: videoLink,
                responseData: responseData.items[0]
            };
            const serverQueueSongs = this.client.queueSongs.get(message.guild.id)

            if (!serverQueueSongs) {
                const queueContruct: QueueItem = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };

                this.client.queueSongs.set(message.guild.id, queueContruct)

                queueContruct.songs.push(song);

                try {
                    let connection = await voiceChannel.join();
                    queueContruct.connection = connection;
                    play(message.guild, queueContruct.songs[0], this.client, message.author)
                } catch (err) {
                    console.log(err);
                    this.client.queueSongs.delete(message.guild.id);
                    return message.channel.send(err);
                }
            } else {
                serverQueueSongs.songs.push(song);
                console.log(serverQueueSongs.songs);
                return message.channel.send(`${message.author}\n- **${song.title}** foi adicionado na fila!`);
            }
        }  catch (error) {
            console.error(error);
            return message.util.reply(error.message).catch(console.error);
        }
    }

}

export default Mp3Play