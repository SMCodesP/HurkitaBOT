import { resolve } from "path";
import CLI from "../..";
import walkSync from "../../../utils/walkSync";

import { CommandCLI } from "./CommandCLI";

export interface OptionsCommandHandler {
    directory: string;
    prefix?: string;
}

export default class CommandHandler {
    commands: CommandCLI[];
    aliases: string[];
    categories: string[];
    options: OptionsCommandHandler;
    client: CLI;

    constructor(options: OptionsCommandHandler) {
        this.options = options
    }

    loadAll(client: CLI) {
        this.client = client
        const listCommands = walkSync(this.options.directory, [])

        this.commands = listCommands.map((path: string) => {
            console.log(path)
            const Command = require(path).default
            const command: CommandCLI = new Command()
            return command
        })

        this.question()
    }

    question() {
        this.client.rl.question('» ', async (answer) => {
            const args = answer.split(' ')
            const command = this.commands.find((command) => command.id === args[0])
            args.shift()
            if (command) {
                await command.exec(args)
            } else {
                console.log('Comando inexistente, utilize help ou ? para listar comandos.')
            }

            this.question()
        })
    }
}