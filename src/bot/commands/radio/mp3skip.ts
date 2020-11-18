import { Command } from "discord-akairo";
import { Message } from "discord.js";

import {BotClientTypes} from "../../";

class Mp3Skip extends Command {
  client: BotClientTypes;

  constructor() {
  	super("mp3skip", {
      aliases: ["mp3skip", "mp3pular"],
      channel: "guild",
      category: "📻 Mp3 rádio | mp3",
      description: {
          content: "Com esse comando você pode pular uma música mp3!",
          metadata: "Mp3 skip; pular;",
          usage: "[command]",
          examples: [
              "[command]",
          ]
      },
  	})
  }

  exec(message: Message) {
    if (!message.member.voice.channel)
        return message.util.reply(
            "você não está em um canal de voz!"
        );

    const serverQueue = this.client.queueSongs.get(message.guild.id)

    if (!serverQueue)
        return message.util.reply(
            `não estou com tocando nenhuma música, então não posso pular.`
        )

    serverQueue.connection.dispatcher.end()

    message.util.reply(
        `você pulou uma música com sucesso!`
    )
  }

}

export default Mp3Skip