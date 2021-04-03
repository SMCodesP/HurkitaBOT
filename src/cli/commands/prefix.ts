import * as db from 'quick.db'
import { CommandCLI } from '../structures/entities/CommandCLI'
import CLI from '..'
import { red, green } from 'colors/safe'

class CommandPrefix extends CommandCLI {
  constructor() {
    super('prefix', {
      name: 'prefix',
      description: {
        content: 'Comando para ver o prefixo de um servidor.',
        usage: '[command]',
      },
    })
  }

  async exec(args: string[], _cli: CLI, _commandUsage: string) {
    const prefix = db.get(`${args[0]}.prefix`) || process.env.PREFIX
    console.cli(`${green('O prefixo do servidor é:')} ${red(prefix)}`)
  }
}

export default CommandPrefix
