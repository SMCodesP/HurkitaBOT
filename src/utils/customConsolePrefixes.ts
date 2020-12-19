import getNowTime from "./getNowTime";
import { cli } from "../index";
import CommandHandler from "../cli/structures/entities/CommandHandler";
import { resolve } from "path";

const originalConsoleLog = console.log

console.log = (...thisArguments: string[]) => {
  const args = [];
  args.push(getNowTime())

  for (var countArgumentsOfRegisterArgs = 0; countArgumentsOfRegisterArgs < thisArguments.length; countArgumentsOfRegisterArgs++) {
    args.push(thisArguments[countArgumentsOfRegisterArgs])
  }

  if (cli) {
    cli.commandHandler = new CommandHandler({
      directory: resolve(__dirname, '..', 'cli', 'commands')
    })
    cli.commandHandler.loadAll(cli)
  }

  originalConsoleLog.apply(console, args)

  if (cli) {
    cli.commandHandler.question()
  }
}