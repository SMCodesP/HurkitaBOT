import { Argument, Command } from "discord-akairo";
import { Message } from "discord.js";

class ClearCommand extends Command {
  constructor() {
    super("clear", {
      aliases: ["clear", "limpar"],
      args: [
        {
          id: "messagesOfDelete",
          type: "number",
        }
      ] ,
      ratelimit: 3,
      channel: "guild"
    })
  }
  
  async exec(message: Message, args: { messagesOfDelete: number }) {
    await message.delete()
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.reply("Você não tem permissão para deletar mensagens.")
    if (message.channel.type == "dm" || message.channel.type == "news")
      return message.reply("Não posso apagar mensagens nesse canal.").then((messageNotPossibleDelete) => messageNotPossibleDelete.delete({ timeout: 2500 }));

    if (args.messagesOfDelete < 1 && args.messagesOfDelete > 100)
      return message.reply("Você não pode apagar mais de 100 mensagens, nem menos de 1 mensagem!").then((messageNotDeleteOfLimitMessages) => messageNotDeleteOfLimitMessages.delete({ timeout: 2500 }));
    
    message.channel.bulkDelete(args.messagesOfDelete)
  }
}

export default ClearCommand