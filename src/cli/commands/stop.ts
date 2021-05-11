import { CommandCLI } from '../structures/entities/CommandCLI'
import CLI from '..'
import { red, yellow } from 'colors/safe'
import { bot, web } from '../..'

class CommandStop extends CommandCLI {
  constructor() {
    super('stop', {
      name: 'stop',
      description: {
        content: 'Comando para fechar todos os apps.',
        usage: '[command]',
      },
    })
  }

  async exec(args: string[], cli: CLI, commandUsage: string) {
    console.log('')

    cli.rl.close()

    console.log(yellow('[Sucesso] Você fechou o app ') + red('CLI'))

    bot.destroy()

    console.log(yellow('[Sucesso] Você fechou o app ') + red('Web'))
    console.log('')

    console.log(red('[Sucesso] Você fechou todos os apps inicializados.'))

    setTimeout(() => {
      web.http.close()
      process.exit()
    }, 500)
  }
}

export default CommandStop
