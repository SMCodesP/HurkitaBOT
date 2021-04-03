import { CommandCLI } from '../structures/entities/CommandCLI'
import { bgGreen, bgWhite, black, bold, red, white, yellow } from 'colors/safe'
import CLI from '..'
import paginate from '../../utils/paginate'

class CommandHelp extends CommandCLI {
  constructor() {
    super('help', {
      name: 'help',
      aliases: ['?'],
      description: {
        content: 'Comando para lhe ajudar com outros comandos.',
        usage: '[command] {page/comando}',
      },
    })
  }

  exec(args: string[], client: CLI, commandUsage: string) {
    const page = Number(args[0]) || 1

    const command =
      client.commandHandler.commands.get(args[0]) ||
      client.commandHandler.commands.get(
        client.commandHandler.aliases.get(args[0]) || ''
      )

    if (command) {
      const aliases = command.options.aliases || []

      console.cli(
        bold(yellow(`---- `)) +
          bold(red(`Help: ${command.id}`)) +
          bold(yellow(` ----`))
      )
      console.cli(
        bold(yellow(`Descrição: `)) +
          bold(white(`${command.options.description.content}`))
      )
      console.cli(
        bold(yellow(`Usável: `)) +
          bold(
            white(
              `${command.options.description.usage.replace(
                '[command]',
                command.id
              )}`
            )
          )
      )
      console.cli(
        bold(yellow(`Aliases: `)) + `[${bold(white(`${aliases.join(', ')}`))}]`
      )
      return
    }

    const commands: Array<Array<CommandCLI>> = paginate(
      client.commandHandler.commands.array(),
      5
    )

    console.cli(
      black(
        bgGreen(`Lista de comandos disponíveis | ${page}/${commands.length}`)
      )
    )
    console.cli('')
    console.cli(
      `Use ${black(
        bgWhite(`${commandUsage} {page/comando}`)
      )} para alterar a página ou para obter mais detalhes de um comando.`
    )
    console.cli('')

    if (!commands[page - 1] || commands[page - 1].length === 0) {
      console.cli(`Nenhum comando encontrado na página especificada.`)
      return
    }

    commands[page - 1].forEach((command: CommandCLI) => {
      console.cli(
        yellow(`${command.id}: `) +
          white(bold(command.options.description.content))
      )
    })
  }
}

export default CommandHelp
