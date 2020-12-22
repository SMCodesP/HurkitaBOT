import { green } from "colors/safe";
import CommandHandler from "./structures/entities/CommandHandler";
import * as readline from "readline";
import { resolve } from "path";

class CLI {
    rl: readline.Interface;
    commandHandler: CommandHandler;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
    }

    registerCommandHandler() {
        this.commandHandler = new CommandHandler({
            directory: resolve(__dirname, 'commands')
        })

        this.commandHandler.loadAll(this)
    }

    
    init() {
        console.cli(`${green('[Sucesso]')} Sistema de CLI foi iniciado!`)
        this.registerCommandHandler()
    }
}

export default CLI