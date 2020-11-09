import { resolve } from "path";
import { AkairoClient, CommandHandler, CommandHandlerOptions } from "discord-akairo";
import { Message } from "discord.js";

class Client extends AkairoClient {
  commandHandler: CommandHandler;
  constructor() {
    super({
      ownerID: process.env.OWNER_ID,
    }, {
      disableMentions: "everyone",
    })

    this.registerCommandHandler({
      prefix: process.env.PREFIX,
      directory: resolve(__dirname, "commands"),
      defaultCooldown: 6e5,
      argumentDefaults: {
        prompt: {
          modifyStart: (_: Message, text: string): string => `${text}\n\nDigite \`cancelar\` para cancelar a sessão do comando.`,
          modifyRetry: (_: Message, text: string): string => `${text}\n\nDigite \`cancelar\` para cancelar a sessão do comando.`,
          timeout: "Você demorou muito para digitar, a sessão do comando foi cancelada",
          ended: "Você antingiu o máximo de tentativas na sessão com comando, então ela foi cancelada.",
          cancel: "A sessão do comando foi cancelada.",
          retries: 3,
          time: 3e4
        }
      },
      ignorePermissions: process.env.OWNER_ID,
      ignoreCooldown: process.env.OWNER_ID,
    })
  }

  registerCommandHandler(options: CommandHandlerOptions) {
    this.commandHandler = new CommandHandler(this, options)
    this.commandHandler.loadAll()
  }
}

export default Client
