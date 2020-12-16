import { CommandCLI } from "../structures/entities/CommandCLI";
import { bot } from "../../index";
import * as db from "quick.db";
import { UserBot } from "../../bot/structures/entities/UserBot";
import { bgWhite, black } from "colors/safe";

class CommandOp extends CommandCLI {
    constructor() {
        super('op', {
            name: 'op',
            description: {
                content: 'Comando para dar permissão global a um usuário.',
                usage: '[command] [userID]'
            }
        })
    }

    async exec(args) {

        const userID = args[0]

        if (!userID)
            return console.log(`Syntax incorreta, utilize o comando dessa forma: ${black(bgWhite(`${this.id} [userID]`))}`)
        
        try {
            const user = await bot.users.fetch(userID)
    
            if (!user)
                return console.log('O usuário digitado é inválido, por favor digite um id válido.')
                
            const userBot: UserBot = db.get(`users.${user.id}`)
            
            
            if (!userBot) {
                db.set(`users.${user.id}`, {
                    id: user.id,
                    roles: ["*"],
                })
            } else {
                db.set(`users.${user.id}.roles`, [...userBot.roles, "*"])
            }
            
            console.log(`Você deu cargo global para o usuário ${black(bgWhite(args[0]))}`)
        } catch (error) {
            console.error(error)
            console.log('O usuário digitado é inválido, por favor digite um id válido.')
        }

    }
}

export default CommandOp
