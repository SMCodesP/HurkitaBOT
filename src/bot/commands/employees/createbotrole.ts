import { Message } from 'discord.js';
import { Command } from "discord-akairo";

class CreateBotRole extends Command {

    constructor() {
        super("createbotrole", {
            aliases: ["createbotrole"],
            category: "👷 Funcionários | workers",
            description: {
                content: "Criar um cargo dentro do bot!",
                metadata: "Create role; criar cargo; cargo; role;",
                usage: "[command] [nome do cargo] [comandos permitidos]",
                examples: [
                    "[command] owner *",
                ]
            }
        })
    }

    exec(message: Message) {

    }

}

export default CreateBotRole