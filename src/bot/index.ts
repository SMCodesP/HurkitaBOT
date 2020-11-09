import { resolve } from "path";
import { AkairoClient, CommandHandler, CommandHandlerOptions } from "discord-akairo";

class Client extends AkairoClient {
  commandHandler: CommandHandler;
  constructor() {
    super({
      ownerID: process.env.OWNER_ID
    }, {
      disableMentions: "everyone"
    })

    this.registerCommandHandler({
      prefix: process.env.PREFIX,
      directory: resolve(__dirname, "commands"),
      defaultCooldown: 50000
    })
  }

  registerCommandHandler(options: CommandHandlerOptions) {
    this.commandHandler = new CommandHandler(this, options)
    this.commandHandler.loadAll()
  }
}

export default Client
