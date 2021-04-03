import { bgWhite, black } from 'colors/safe'
import { Collection } from 'discord.js'
import { resolve } from 'path'
import CLI from '../..'
import walkSync from '../../../utils/walkSync'

import { CommandCLI } from './CommandCLI'

export interface OptionsCommandHandler {
  directory: string
  prefix?: string
}

export default class CommandHandler {
  commands: Collection<string, CommandCLI>
  aliases: Collection<string, string>
  categories: string[]
  options: OptionsCommandHandler
  client: CLI

  constructor(options: OptionsCommandHandler) {
    this.options = options
  }

  loadAll(client: CLI) {
    this.client = client
    this.aliases = new Collection()
    this.commands = new Collection()
    const listCommands = walkSync(this.options.directory, [])

    listCommands.forEach((path: string) => {
      const Command = require(path).default
      const command: CommandCLI = new Command()
      this.commands.set(command.id, command)
    })

    this.commands.forEach((command) => {
      const aliases = command.options.aliases || []
      aliases.forEach((aliase) => {
        this.aliases.set(aliase, command.id)
      })
    })

    this.question()
  }

  question() {
    this.client.rl.question('- ', async (answer) => {
      const args = answer.split(' ')
      const command =
        this.commands.get(args[0]) ||
        this.commands.get(this.aliases.get(args[0]) || '')

      args.shift()

      if (command) {
        await command.exec(args, this.client, answer.split(' ')[0])
      } else {
        console.cli(
          `Comando inexistente, utilize ${black(bgWhite(`help`))} ou ${black(
            bgWhite(`?`)
          )} para listar comandos.`
        )
      }

      this.question()
    })
  }
}
