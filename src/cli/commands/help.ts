import { CommandCLI } from "../structures/entities/CommandCLI";
import { bgGreen, bgWhite, black, bold, white, yellow } from "colors/safe";
import CLI from "..";

class CommandHelp extends CommandCLI {
    constructor() {
        super('help', {
            name: 'help',
            aliases: ['?'],
            description: {
                content: 'Comando para lhe ajudar com outros comandos.',
                usage: '[command] {page/comando}'
            }
        })
    }

    exec(_: string[], client: CLI, commandUsage: string) {
        console.log(black(bgGreen(`Lista de comandos disponíveis`)))
        console.log("")
        console.log(`Use ${black(bgWhite(`${commandUsage} {page/comando}`))} para alterar a página ou para obter mais detalhes de um comando.`)
        console.log("")
        client.commandHandler.commands.forEach((command) => {
            console.log(yellow(`${command.id}: `) + white(bold(command.options.description.content)))
        })
    }
}

export default CommandHelp
