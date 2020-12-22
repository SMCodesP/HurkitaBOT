import { CommandCLI } from "../structures/entities/CommandCLI";
import CLI from "..";
import { red, yellow } from "colors/safe";
import { bot, web } from "../..";

class CommandStop extends CommandCLI {
    constructor() {
        super('stop', {
            name: 'stop',
            description: {
                content: 'Comando para fechar todos os apps.',
                usage: '[command]'
            }
        })
    }

    async exec(args: string[], cli: CLI, commandUsage: string) {

        console.cli("")
        
        cli.rl.close()

        console.cli(yellow('[Sucesso] Você fechou o app ') + red('CLI'))

        bot.destroy()
        
        console.bot(yellow('[Sucesso] Você fechou o app ') + red('Bot'))

        web.server.close()
        
        console.web(yellow('[Sucesso] Você fechou o app ') + red('Web'))
        console.cli("")

        console.cli(red('[Sucesso] Você fechou todos os apps inicializados.'))

        process.exit()

    }

}

export default CommandStop
