import { Command } from "discord-akairo";
import { Message } from "discord.js";

class SayCommand extends Command {
  constructor() {
    super("say", {
      aliases: ["say", "falar"],
      category: "👮‍♂️ Moderação | mod",
      description: {
        content: "Com esse comando você pode por palavras na minha boca.",
        usage: "[command] [texto]"
      },
      channel: "guild",
      args: [
        {
          id: "text",
          match: "content"
        }
      ],
    })
  }

  async exec(message: Message, args: { text: string; }) {
    await message.delete()
    return message.channel.send(args.text)
  }
}

export default SayCommand