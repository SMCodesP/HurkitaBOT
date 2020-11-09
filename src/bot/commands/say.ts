import { Command } from "discord-akairo";
import { Message } from "discord.js";

class SayCommand extends Command {
  constructor() {
    super("say", {
      aliases: ["say", "falar"],
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