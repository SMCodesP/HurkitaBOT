import { Message } from 'discord.js';
import { Command } from "discord-akairo";

class BanCommands extends Command {

    constructor() {
        super("bancommands", {
            aliases: ["bancommands"],
            category: "👷 Funcionários | workers",
            description: {
                content: "Banir um usuário de usar meus comandos!",
                metadata: "Comando para banir no meu sistema; banir; ban; remove;",
                usage: "[command] [@user/userID]",
                examples: [
                    "[command] @SMCodes#4207",
                ]
            }
        })
    }

    exec(message: Message) {

    }

}

export default BanCommands