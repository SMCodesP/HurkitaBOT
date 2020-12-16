import { green } from "colors/safe";
import * as readline from "readline";

class CLI {
    rl: readline.Interface

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
    }

    questionContinue() {
        this.question()
    }

    question() {
        this.rl.question('» ', (answer) => {
            this.question()
        })
    }
    
    init() {
        console.log(`${green('[Sucesso]')} Sistema de CLI foi iniciado!`)
        this.questionContinue()
    }
}

export default CLI