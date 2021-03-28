import getNowTime from "./getNowTime";
import { cli, web } from "../index";
import CommandHandler from "../cli/structures/entities/CommandHandler";
import { resolve } from "path";
import { cyan, green, white } from "colors/safe";
import * as socketIo from "socket.io";

declare global {
  interface Console {
    cli: (payload: any) => void
    bot: (payload: any) => void
    web: (payload: any) => void
    original: (payload: any) => void
  }
}

let logs = []
const originalConsoleLog = console.log

export function customizeConsole(io: socketIo.Server) {
  console.original = (...thisArguments: string[]) => {
    originalConsoleLog.apply(console, thisArguments)
    
    if (cli) {
      cli.commandHandler.question()
    }
  }

  console.bot = (...thisArguments: string[]) => {
    const args = [];
    args.push(getNowTime())
    args.push(green(`[Bot]`) + " -")

    for (var countArgumentsOfRegisterArgs = 0; countArgumentsOfRegisterArgs < thisArguments.length; countArgumentsOfRegisterArgs++) {
      args.push(thisArguments[countArgumentsOfRegisterArgs])
    }

    if (cli) {
      cli.commandHandler = new CommandHandler({
        directory: resolve(__dirname, '..', 'cli', 'commands')
      })
      cli.commandHandler.loadAll(cli)
    }

    logs.push(args.join(' '))
    io.sockets.in('logging').emit('log', args)
    originalConsoleLog.apply(console, args)

    if (cli) {
      cli.commandHandler.question()
    }
  }

  console.web = (...thisArguments: string[]) => {
    const args = [];
    args.push(getNowTime())
    args.push(white(`[Web]`) + " -")

    for (var countArgumentsOfRegisterArgs = 0; countArgumentsOfRegisterArgs < thisArguments.length; countArgumentsOfRegisterArgs++) {
      args.push(thisArguments[countArgumentsOfRegisterArgs])
    }

    if (cli) {
      cli.commandHandler = new CommandHandler({
        directory: resolve(__dirname, '..', 'cli', 'commands')
      })
      cli.commandHandler.loadAll(cli)
    }

    logs.push(args.join(' '))
    io.sockets.in('logging').emit('log', args)
    originalConsoleLog.apply(console, args)

    if (cli) {
      cli.commandHandler.question()
    }
  }

  console.cli = (...thisArguments: string[]) => {
    const args = [];
    args.push(getNowTime())
    args.push(cyan(`[CLI]`) + " -")

    for (var countArgumentsOfRegisterArgs = 0; countArgumentsOfRegisterArgs < thisArguments.length; countArgumentsOfRegisterArgs++) {
      args.push(thisArguments[countArgumentsOfRegisterArgs])
    }

    if (cli) {
      cli.commandHandler = new CommandHandler({
        directory: resolve(__dirname, '..', 'cli', 'commands')
      })
      cli.commandHandler.loadAll(cli)
    }

    logs.push(args.join(' '))
    io.sockets.in('logging').emit('log', args)
    originalConsoleLog.apply(console, args)

    if (cli) {
      cli.commandHandler.question()
    }
  }

  console.log = (...thisArguments: string[]) => {
    const args = [];
    args.push(getNowTime() + " -")

    for (var countArgumentsOfRegisterArgs = 0; countArgumentsOfRegisterArgs < thisArguments.length; countArgumentsOfRegisterArgs++) {
      args.push(thisArguments[countArgumentsOfRegisterArgs])
    }

    if (cli) {
      cli.commandHandler = new CommandHandler({
        directory: resolve(__dirname, '..', 'cli', 'commands')
      })
      cli.commandHandler.loadAll(cli)
    }

    logs.push(args.join(' '))
    io.sockets.in('logging').emit('log', args)
    originalConsoleLog.apply(console, args)

    if (cli) {
      cli.commandHandler.question()
    }
  }
}