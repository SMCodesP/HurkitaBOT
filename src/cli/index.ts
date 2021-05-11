import { bgWhite, black, green } from 'colors/safe'
import CommandHandler from './structures/entities/CommandHandler'
import * as readline from 'readline'
import { resolve } from 'path'
import { io, web } from '..'
import * as jwt from 'jsonwebtoken'

class CLI {
  rl: readline.Interface
  commandHandler: CommandHandler

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  registerCommandHandler() {
    this.commandHandler = new CommandHandler({
      directory: resolve(__dirname, 'commands'),
    })

    this.commandHandler.loadAll(this)
  }

  init() {
    console.log(`${green('[Sucesso]')} Sistema de CLI foi iniciado!`)
    this.registerCommandHandler()

    this.ioEvents()
  }

  ioEvents() {
    io.on('connection', (socket: any) => {
      socket.on(
        'commandHandler',
        async ({
          commandString,
          token,
        }: {
          commandString: string
          token: string
        }) => {
          try {
            jwt.verify(token, process.env.JWT_SECRET)
          } catch (error) {
            return console.log('Você não pode executar esse comando!')
          }

          const args = commandString.split(' ')
          const command =
            this.commandHandler.commands.get(args[0]) ||
            this.commandHandler.commands.get(
              this.commandHandler.aliases.get(args[0]) || ''
            )

          args.shift()

          if (command) {
            await command.exec(
              args,
              this.commandHandler.client,
              commandString.split(' ')[0]
            )
          } else {
            console.log(
              `Comando inexistente, utilize ${black(
                bgWhite(`help`)
              )} ou ${black(bgWhite(`?`))} para listar comandos.`
            )
          }

          this.commandHandler.question()
        }
      )
    })
  }
}

export default CLI
