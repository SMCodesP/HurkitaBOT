import { Message } from 'discord.js';
import { Command } from "discord-akairo";

class SetBotRole extends Command {

    constructor() {
        super("setbotrole", {
            aliases: ["setbotrole"],
            category: "👷 Funcionários | workers",
            description: {
                content: "Setar cargos dentro do bot!",
                metadata: "Set role; setar permissão; dar cargo; role; cargo;",
                usage: "[command] [role] [@user/userID]",
                examples: [
                    "[command] owner @SMCodes#4207",
                ]
            }
        })
    }

    exec(message: Message) {

    }

}

export default SetBotRole