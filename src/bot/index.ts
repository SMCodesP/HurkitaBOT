import { resolve } from "path"
import { green, red } from "colors/safe";
import * as db from 'quick.db'
import { AkairoClient, CommandHandler, CommandHandlerOptions, SQLiteProvider } from "discord-akairo"
import { Message } from "discord.js"

interface BotClientTypes extends AkairoClient {
  commandHandler: CommandHandler;
  registerCommandHandler(options: CommandHandlerOptions): void;
  init(token: string): Promise<void>
}

class BotClient extends AkairoClient implements BotClientTypes {
  commandHandler: CommandHandler;
  settings: SQLiteProvider;

  constructor() {
    super({
      ownerID: process.env.OWNER_ID,
    }, {
      disableMentions: "everyone",
    })

    this.registerCommandHandler({
      prefix: (message) => {
        if (message.guild)
          return db.get(`${message.guild.id}.prefix`) || process.env.PREFIX

        return process.env.PREFIX
      },
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

  async init(token: string) {
    return super.login(token)
      .then(() => {
        console.log(`${green("[Sucesso]")} O bot foi iniciado!`)
      }).catch((err) => {
        console.log(`${red("[Error]")} Houve um erro ao iniciar o bot.`)
        console.log(err)
      })
  }
}

export default BotClient
export type { BotClientTypes }
