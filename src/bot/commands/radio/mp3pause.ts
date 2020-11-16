import { Message } from "discord.js";
import { Command } from "discord-akairo";
import {BotClientTypes} from '../../';

class Mp3Pause extends Command {
    client: BotClientTypes;

    constructor() {
        super("mp3pause", {
            aliases: ["mp3pausar", "mp3pause"],
            category: "📻 Mp3 rádio | mp3",
            description: {
                content: "Com ele você pode pausar uma música mp3!",
                metadata: "Mp3 pause; pausar; stop;",
                usage: "[command]",
                examples: [
                    "[command]",
                ]
            },
        })
    }

    async exec(message: Message) {
        if (!message.member.voice.channel)
            return message.util.reply(
                "você não está em um canal de voz!"
            );

        const serverQueue = this.client.queueSongs.get(message.guild.id)

        if (!serverQueue)
            return message.util.reply(
                `não estou com nenhuma música rodando então não posso pausa-la.`
            )

        serverQueue.connection.dispatcher.pause()

        message.util.reply(
            `a música **${serverQueue.songs[0].title}** foi pausada com sucesso!`
        )
    }
}

export default Mp3Pause